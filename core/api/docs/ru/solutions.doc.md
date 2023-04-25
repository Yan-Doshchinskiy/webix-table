## Problems and Solutions

Перед началом использования `Api Module` нужно понять какие проблемы мы решаем 
и какие преимущества имеет данное решение перед уже существующими.

Для сравнения будем рассматривать библиотеку `NuxtAxios`.

### 1. Декомпозиция.
Правильное использование клиента `axios` подразумевает формирование функций,
отправляющих запросы на разные `endpoints` и вызов этой функции в нужных частях приложения. 

Преимуществом такого подхода является легкая поддержка кода и его устойчивость к изменениям.
Если интерфейс или `url` запроса изменится, то будет достаточно внести изменения только в одном месте.

`NuxtAxios` самостоятельно создает инстанс `axios` и инжектит его в глобальный контекст `Nuxt`,
предоставляя доступ к клиенту с помощью ключа `$axios`. 
Его использование подразумевает вызов `$axios` для формирования и отправки запроса в любом месте,
где доступен контекст `Nuxt`.
Библиотека не предоставляет инструментов для декомпозиции запросов до момента создания инстанса.

Декомпозицию запросов для `NuxtAxios` можно реализовать несколькими путями:
#### 1.1. Создание функций внутри плагина и `inject` объектов с этими функциями в глобальный контекст
```
export default async function axios({
  $axios
}, inject) {
  async function fetchNotifications(payload) {
    const response = await $nuxt.$axios.$get('/v1/profile/notifications', payload);
    return response.result;
  }
  async function deleteNotification(id) {
    await $nuxt.$axios.$delete(`/v1/profile/notifications/${id}`);
  }
  const enableTwoFA = async (code) => {
    await $nuxt.$axios.$post('/v1/2fa/enable', { code });
  };
  
  const disableTwoFA = async (code) => {
    await $nuxt.$axios.$post('/v1/2fa/disable', { code });
  };
  const api = {
    notifications: {
      fetchNotifications,
      deleteNotification
    },
    2fa: {
      enableTwoFA,
      disableTwoFA
    }
  }
  
  inject('api', api);
}
```
В приложениях среднего размера мы имеем не менее 10-20 `endopits`.
Если разместить все эти запросы в одном файле, то он станет нечитаемым.

Можно логически разбить запросы и разместить их в разных плагинах, 
но тогда мы необоснованно увеличим количество плагинов, что в целом усложнит логику проекта.

К тому же на придется в каждом плагине проводить `inject`, 
что помимо количества плагинов увеличит количество глобальных переменных.

Можно в каждом плагине брать объект api, расширять его и проводить `inject` заново в тот же самый ключ.
Это решение выглядит очень ненадежно и практически не типизируется.

#### 1.2. Создание отдельных файлов с запросами, использующими глобальную переменную `$nuxt`.

Пример структуры папок:
```
project
│
└───api
│   │   notifications
│   │   2fa
│
```
```
/api/notifications.js

export async function fetchNotifications(payload) {
  const response = await $nuxt.$axios.$get('/v1/profile/notifications', payload);
  return response.result;
};
export async function deleteNotification(id) {
  await $nuxt.$axios.$delete(`/v1/profile/notifications/${id}`);
};

/api/2fa.js

export const enableTwoFA = async (code) => {
  await $nuxt.$axios.$post('/v1/2fa/enable', { code });
};

export const disableTwoFA = async (code) => {
  await $nuxt.$axios.$post('/v1/2fa/disable', { code });
};
```
Эти функции можно импортировать в любое место приложения и использовать для отправки запросов.
Также можно экспортировать из каждого файла объект, содержащий функции, 
чтобы сделать отправку запросов более очевидной. 

Основная проблема этой концепции - использование глобальной переменной в файлах, 
не имеющих доступ к контексту `Nuxt`. 

Есть высокий риск возникновения ошибок, т.к. `$nuxt` это сокращенная запись `window.$nuxt`.
Объект `window` будет недоступен при `SSR mode`. 
Соответственно мы получим ошибку, когда попытаемся получить ключ `$nuxt` у `undefined`.
Это очень неочевидное поведение и процесс поиска и исправления ошибок может занять длительное время.

К тому же нелогично создавать глобальную переменную в контексте `Nuxt` и 
пытаться на основании нее создавать функции вне контекста.
Гораздо логичнее было бы создать функции, после чего поместить их в контекст.

#### 1.3. Вынести логику запросов в отдельный класс, и провести `inject` в глобальный контекст `Nuxt` через плагин.

Этот подход напоминает подход `1.1` и является достаточно логичным.

Все что нам нужно это создать класс, принимающий в конструктор инстанс `$axios`, 
который мы возьмем из контекста `Nuxt`. 

```
abstract class ApiService {
  protected readonly api: NuxtAxios;
  constructor(api: NuxtAxios) {
    this.api = api;
  }
}

export default ApiService;
```
Создать несколько подклассов от этого абстрактного класса и поместить туда запросы.
```
class NotificationsService extends ApiService {
  public async fetchNotifications(payload:IPayloyad):Promise<INotifications> {
    const { result } = await this.api.$get('/v1/profile/notifications', payload);
    return result;
  }

  public async deleteNotification(id:string):Promise<void> {
    await this.api.$delete(`/v1/profile/notifications/${id}`);
  }
}
```
```
class TwoFaService extends ApiService {
  public async enableTwoFA(code:string):Promise<void> {
    await this.api.$post('/v1/2fa/enable', { code });
  }

  public async disableTwoFA(code:string):Promise<void> {
    await this.api.$post('/v1/2fa/disable', { code });
  }
}
```
После создать класс для композиции этих сервисов.
```
class ApiClient {
  public readonly services: any;
  constructor(nuxtAxios: NuxtAxios) {
    this.services = {
      notifications: new NotificationsService(nuxtAxios),
      '2fa': new TwoFaService(nuxtAxios)
    };
  }
}
```
После нужно создать инстанс этого класса внутри плагина и провести `inject` в глобальный контекст.
```
export default async function axios({
  $axios
}, inject) {
  const api = new ApiClient($axios);  
  inject('api', api.services);
}
```

Этот подход самый логичный и безопасный.

Проблемой является то, что использование `nuxtAxios` в этом случае полностью теряет смысл, 
т.к. берет на себя только создание инстанса `axios` через `axios.create(...)`. 

### 2. Multi Modules
В некоторых проектах есть необходимость создания нескольких `Api Module`.

Эти модули должны иметь разные `baseUrl` и разную логику авторизации.

Например, основной `MainModule` ожидает полностью интегрированную логику авторизации,
основанную на паре `access` и `refresh` токенов.

Модуль для работы с файлами `FileModule` не имеет постоянных токенов и никак не связан с авторизацией `MainModule`.

Для реализации такого решения необходимо создание отдельных инстансов с разными опциями и `interceptors`.

`Nuxt axios` предоставляет возможность реализовать несколько модулей, с помощью `$axios.create(...)`.
Основная проблема остается такой же, как и в `пункте 1` - вся логика нового модуля должна формироваться в плагине.
Это приводит к тому же выводу, что логику из плагина проще всего вынести в отдельный класс, 
но это не имеет смысла, т.к. `axios.create(...)` доступен в базовой реализации библиотеки `axios`.

Данная реализация `Api Module` изначально поддерживает возможность создания неограниченного количества модулей.
Для создания любого модуля может быть использован абстрактный класс [Api Module](../../modules/api.module.ts).

`Api Module` позволяет через конструктор присвоить `baseUrl` и `options`.

- baseUrl - определяют начальную часть `URL` для отправки запросов
- options - позволяет передать в модуль любые параметры и объекты, 
которые позже должны быть использованы при создании контроллеров

Для типизации используются `generic` типы `<S>` и `<O>`.
- `<S>` - отвечает за типизацию свойства `controllers` и определяет какие контроллеры должен содержать модуль;
- `<O>` - отвечает за типизацию `options`, передаваемых в конструктор суперкласса `ApiModule`. 
Должен наследоваться от типа `IApiModuleOptions`.

```
interface ITestControllers {
  profile: TestProfileController,
  market: TestMarketController
}

interface ITestOptions extends IApiModuleOptions {
  store: IStoreModules
}

class TestModule extends ApiModule<ITestControllers, ITestOptions> {
   constructor(baseUrl: string, options: ITestOptions) {
    super(baseUrl, options);
    this.controllers = {
      profile: new TestProfileController(this.apiClient, {
        store: this.options.store,
        controllerUrl: '/profile',
      }),
      market: new TestMarketController(this.apiClient, {
        store: this.options.store,
        controllerUrl: '/market'
      }),
    };
   }
}
```

Появляется возможность использовать один модуль внутри другого.
Можно передать инстанс другого модуля в `options` через конструктор.

Дополнительным плюсом является формирование всех инстансов модулей через один суперкласс `ApiModule`.
В некоторых ситуациях это может позволить облегчить типизацию, за счет указаниям типа `ApiModule`,
который будет поддерживать использование любого подкласса `ApiModule`, но ограниченного интерфейсом `ApiModule`.

### 3. Authorization
`Api Module` позволяет замкнуть менеджмент токенов авторизации внутри самого модуля и 
сокращает количество внешнего кода, необходимого для настройки.

Для модулей требующий авторизацию, внутри создается отдельный контроллер, 
отвечающий за получение, хранение и обновление состояния токенов.

Внутри инстанса постоянно хранятся актуальные значения, 
которые могут быть привязаны к состоянию внешних компонентов с помощью `state manager`(vuex, redux, etc.).
Также для обеспечения реактивности может быть использована реализация, использующая `Observer`.
