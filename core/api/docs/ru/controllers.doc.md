## Controllers


### 1. ApiController(abstract)
Абстрактный контроллер. Предназначен для создания подклассов.

#### Constructor
| Name        | Type                              | Description                                  |
|-------------|-----------------------------------|----------------------------------------------|
| apiClient   | AxiosInstance                     | apiClient instance for HTTP requests sending |
| options     | <O extends IApiControllerOptions) | Controller options (store, controllerUrl).   |

#### Properties
| Name           | Access Modifier | Type                  | Description                                                  |
|----------------|-----------------|-----------------------|--------------------------------------------------------------|
| apiClient      | protected       | AxiosInstance         | Axios instance provided by ApiModule.                        |
| options        | protected       | IApiControllerOptions | controller options (store, cookies, etc.                     |
| controllerUrl  | protected       | string                | Controller url. Connects to baseUrl and creates the full URL |

#### Methods
| Name        | Access Modifier | Return Type              | Description                      |
|-------------|-----------------|--------------------------|----------------------------------|
| get         | protected       | Promise<R>(generic type) | send request with GET method     |
| post        | protected       | Promise<R>(generic type) | send request with POST method    |
| put         | protected       | Promise<R>(generic type) | send request with PUT method     |
| delete      | protected       | Promise<R>(generic type) | send request with DELETE method  |
| _getFullUrl | private         | string                   | get full URL for request sending |

### 2. ExampleController
Является подклассом абстрактного класса ApiController.
Предназначен для декомпозиции всех запросов в отдельные инстансы.

Для каждого отдельного пути по типу `profile`, `dashboard`, `marketplace` и прочего должен созаваться отедльный контроллер.
Это обеспечит максимальную прозрачность при работе с `ApiModule`.

В большей части случаев такие контроллеры не требуют доработки и не требуют создания отдельного конструктора,
а могут использовать конструктор своего суперкласса `ApiController`.

При создании контролера можно передать `generic type <O extends IApiControllerOptions>` в `ApiController`.
Это позволит типизировать ожидаемый аргумент `options`. 
Это необходимо, если контроллер ожидает получение дополнительных опций по типу `store`, `cookies` и прочего.

При вызове `protected` методов `get`, `post`, `put` и `delete` можно передать типы `P` и `D` в качестве `generic type`.

Type `P` обязатален для метода `get` и опционален для остальных методов.
Это тип ожидаемого ответа.
В методе `get` тип нужно указывать всегда, т.к. данные могут быть сохранены в `store` или в контекст компонента.
В методах `post`, `put` и `delete` можно не передавать ожидаемый тип только в тех в случаях, когда ответ нигде не используется.

Type `D` отвечает за отправляемый `payload` и передается в тип `AxiosConfig<D>`. Type `D` является опциональным для всех типов запросов.
Тип не обязателен к использованию,
т.к. тип payload определяется в аргументах методов `ExampleController` и находится под контролем разработчика.

#### Example:
```
baseUrl: 'https://example.com' - передается в `Module` для создания `ApiClient`
controllerUrl: '/marketplace' - передается в конструктор `ExampleController`, являющегося подклассом абстрактного класса `ApiController`.

class ExampleController extends ApiController {
  public async getMyApps(): Promise<IAppList> {
    return this.get<IAppList>('/apps');
  }
  public async createNewApp(payload: IApp): Promise<IAppResponse> {
    return this.post<IAppResponse>('/new', payload);
  }
  public async updateUserData(payload: IData): Promise<IOrganizationProviderInfo> {
    return this.put<IOrganizationProviderInfo>('/update', payload);
  }
  public async deleteApp(id: string): Promise<IDeleteResponse> {
    return this.delete<IDeleteResponse>('/delete', { params: { id } });
  }
}

При вызове публичного метода getUserData запрос будет отправлен на 'https://example.com/profile/me'.
В качестве ответа ожидается объект с интерфейсом IExampleResponse.
```

`Store` может быть использован в качестве хранилища возвращаемых значений запросов прямо внутри контролера.

`Store` необходимо использовать только в случаях, если данные, возвращаемые запросом,
используеются многократно в разных частях приложения и их передача через систему `props` слишком накладна.
Перед сохранением ответа в `store` возвращаемый `Promise` должен быть `resolved`.

#### Example with store usage:
```
class ExampleController extends ApiController {
  public async getMyApps(): Promise<IAppList> {
    const response = await this.get<IAppList>('/apps');
    this.store.example.setAppList(response);
    return response;
  }
}
```

### 3. AuthController:
Является подклассом абстрактного класса ApiController.
Предназначен для имплементации логики авторизации и системы менеджмента `accessToken` и `refreshToken`.

Позволяет инкапсулировать логику запроса, сохранения и очистки пары токенов для авторизации.
Для хранения токенов используется глобальный `store` приложения и `cookies`.

`Store` позволяет определить статус авторизации пользователя по наличию токенов авторизации в любом месте приложения.

`Cookies` позволяют сохранить актуальное состояние токенов в `store` сразу после запуска приложения.

Геттеры `accessToken` и `refreshToken` позволяют получить актуальные значения токенов авторизации,
чтобы использовать их в момент конфигурации `ApiClient interceptors`.

Метод `signIn` осуществляет отправку запроса авторизации на сервер с установленным `payload`.
Ожидаемым ответом является интерфейс IAuthTokensMain, содержащий в себе пару токенов авторизации.
После получения токенов вызывается `private` метод `_updateTokens`,
который сохраняет новый пару токенов в `store` и `cookies`,
а также запускает `_refreshTokenTimeout`.

Метод `signOut` осуществляет удаление токенов авторизации из `store` и `cookies` с помощью `private` метода `_clearTokens`.

Метод `requestTokensByRefresh` осуществляет логику получения новой пары токенов авторизации с помощью `refreshToken`.
Этот метод предназначен для использования внутри `Response ApiClient interceptor`, при получении ошибки авторизации 401.
Метод позволяет избежать дублирования запросов на обновление пары токенов.
Угроза дублирования возникает в ситуации, когда экземпляр `ApiClient`, созданный в `ApiModule`,
отправляет одновременно несколько параллельных запросов с истекшим `accessToken`.
Это приводит к получению нескольких ошибок 401 и многократному запуску логиики `response interceptor`.

#### Для защиты от повторной отправки используются несколько мехнизмов:
- `_refreshPromise` хранит в себе Promise запроса `refresh-token`.
  Если несколько параллельных запросов попадают в метод `requestTokensByRefresh`, то запрос отправит только первый из них.
  Остальные не будут отправлять запрос, а лишь дожидаться `resolve` одного и того же Promise.

- `_refreshTokenTimeout` запускается после обновления токенов в `private` методе `_updateTokens`.
  Если таймаут был запущен, то запросы, вызывающие `requestTokensByRefresh` будут получать новую пару токенов не из Promise,
  а из `store`. Это необходимо в том случае, когда параллельно было отправлено большое количество запросов (15 и более).
  В этот момент возникает ситуация, когда несколько запросов успевают взять значение токенов из Promise,
  после чего он становится `resolved` и `_refreshPromise` меняет свое значение на `null`,
  а другие запросы, оправленные с истекшим `accessToken`,  но обработанные позже, также заходят в функцию
  `requestTokensByRefresh` и отправляют повторный запрос на 'refresh-token', хотя в `storage` уже хранится актуальное состояние.


#### Constructor
| Name        | Type                      | Description                                             |
|-------------|---------------------------|---------------------------------------------------------|
| apiClient   | AxiosInstance             | apiClient instance for HTTP requests sending            |
| options     | IApiAuthControllerOptions | AuthController options (store, controllerUrl, cookies). |

#### Properties
| Name                  | Access Modifier | Type                             | Description                                                                                                                                                                     |
|-----------------------|-----------------|----------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _refreshPromise       | private         | null or Promise<IAuthTokensMain> | Promise of request to receive a new token pair                                                                                                                                  |
| _refreshTokenTimeout  | private         | any                              | The timeout set since the last refresh of the tokens. At this time, for arrival with 401 errors, a new pair of tokens is taken not from Promise, but from the controller state. |
| _refreshTokenPath     | private         | string                           | Request route path for refreshing token pair                                                                                                                                    |
| _cookieManager        | private         | NuxtCookies                      | Cookies instance provided by ApiModule                                                                                                                                          |


#### Methods
| Name                   | Access Modifier | Return Type              | Description                                                     |
|------------------------|-----------------|--------------------------|-----------------------------------------------------------------|
| accessToken            | public get      | string                   | current accessToken value                                       |
| refreshToken           | public get      | string                   | current refreshToken value                                      |
| signIn                 | public          | Promise<IAuthTokensMain> | SignIn request. Set new tokens after response promise resolving |
| signOut                | public          | void                     | SignOut. Clear tokens state.                                    |
| requestTokensByRefresh | public          | Promise<IAuthTokensMain> | Refresh token pair via refresh-token request                    |
| _updateTokens          | private         | void                     | Set new tokens to storage and cookies.                          |
| _clearTokens           | private         | void                     | Remove tokens from storage and cookies.                         |
