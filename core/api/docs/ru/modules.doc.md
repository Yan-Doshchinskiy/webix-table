## Modules

Модуль инкапсулирует в себе инстанс `ApiClient`.
Может конфигурироваться с помощью `interceptors`.

Предназначен для централизации запросов к одному `endpoint` и создания единой логики авторизации.

Правильное использование подразумевает под собой создание одного экземпляра модуля для одного `endpoint`.

При использовании `Nuxt` рекомендуется использовать `inject` в отдельном плагине,
для передачи инстанса модуля в глобальный контекст.
Конфигурация `interceptors` также должна проводиться в плагине после создания инстанса модуля.

### 1. ApiModule(abstract)

Абстрактный модуль для создания подклассов.
Предназначен для создания `ApiClient` для отправки запросов.

`ApiClient` является `protected` свойством, поэтому для добавления `interceptors` создано
2 специальных метода `addResponseInterceptor` и `addRequestInterceptor`.

Модуль делегирует отправку запросов своим контроллерам, которые создаются в подклассах `ApiModule`.

`ApiClient` используется при создании контроллеров в подклассах.

Метод `sendRequest` - единственный способ отправить запрос непосредственно из модуля.
Предназначен для отправки запроса с уже готовым `config`.
Рассчитан на применение внутри `response interceptor`.

Модуль принимает в себе `generic type` `<S>`, который отвечает за типизацию свойства `controller`,
содержащего инстансы `Controller`.

Модуль принимает в себе `generic type` `<O>`, который отвечает за типизацию свойства `options`.
Свойство `options` предназначено для хранения дополнительных опций,
необходимых для создания инстансов контроллеров.

Имеется возможность установить базовые `interceptors` с помощью передачи `config` в конструктор `ApiModule`.
Базовые `ibterceptors` уже заданы внутри `ApiModule` в виде приватных методов.
`Default Response interceptor` обрабатывает каждый ответ и возвращает из него `data`.
`Deefault Request interceptor` задан пустым.


- Аргумент конструктора `baseUrl` предназначен для передачи в метод `axios.create`,
  для создания инстанса `ApiClient`.
- Аргумент конструктора `options` представляет из себя набор инстансов и опций,
  которые сохраняются в свойствах класса для использования при создании контроллеров
  в подклассах ApiModule.
- Аргумент конструктора `config` содержит базовую конфигурацию модуля.
  В данный момент имеет 2 св-ва, позволяющих добавить дефолтные `interceptors` для `Response` и `Request`.

#### Constructor

| Name    | Type                          | Description                           |
|---------|-------------------------------|---------------------------------------|
| baseUrl | string                        | baseUrl for ApiClient                 |
| options | <O extends IApiModuleOptions> | Module options (cookies, store, etc.) |
| config  | IApiModuleConfig              | Module base config                    |

#### Properties

| Name        | Access Modifier | Type                          | Description                                  |
|-------------|-----------------|-------------------------------|----------------------------------------------|
| apiClient   | protected       | AxiosInstance                 | Axios instance created via axios.create(...) |
| options     | protected       | <O extends IApiModuleOptions> | Options for controllers instances creating   |
| controllers | public          | S(generic type)               | Controllers map                              |

#### Methods

| Name                            | Access Modifier | Return Type  | Description                                                                         |
|---------------------------------|-----------------|--------------|-------------------------------------------------------------------------------------|
| addResponseInterceptor          | public          | void         | Add response interceptor for ApiClient                                              |
| addRequestInterceptor           | public          | void         | Add request interceptor for ApiClient                                               |
| sendRequest                     | public          | Promise<any> | Send request with completed config via ApiClient                                    |
| _addDefaultRequestInterceptor   | private         | void         | Add default request interceptor. Is it empty at the moment                          |
| _addDefaultResponseInterceptor  | private         | void         | Add default response interceptor. Each response returns data property from response |

### 2. MainModule

Является подклассом абстрактного класса `ApiModule`.

Не расширяет логику `ApiModule`,
а только лишь создает инстансы нужных контроллеров в соответствии с интерфейсом IMainControllers.

Внутри модуля предусматривается логика авторизации с помощью `accessToken` и `refreshToken`.
Логика авторизации делегируется контроллеру `AuthController`.
