# Commit Flow

`Commit flow` очень важный аспект в разработке любого приложения.

Он позволяет стандартизировать процесс фиксации изменений.

За счет этого любой разработчик сможет понять суть изменений каждой фиксации,
даже не открывая содержимое коммита.

Большим преимуществом единого `commit flow` является гибкая генерация `Changelog`.

Также становится проще соблюдение версионности проекта.

## 1.Setup

Для организации `commit flow` мы будем использовать библиотеки`husky`, `commitlint` и `standard-version`.

### Install

```
npm i -D @commitlint/cli @commitlint/config-conventional husky standard-version

or

yarn add -D @commitlint/cli @commitlint/config-conventional husky standard-version
```

### Versions

Напротив пакетов указаны версии на момент написания документации.

- "@commitlint/cli": "^17.2.0",
- "@commitlint/config-conventional": "^17.2.0",
- "husky": "^8.0.1",
- "standard-version": "^9.5.0"

Все эти зависимости должны быть установлены в качестве `devDependencies`.

### Scripts

Необходимо добавить основные `scripts` в `package.json` файл.

- `"release": "standard-version"`,

Повышает текущую версию приложения, генерирует `Changelog`.
Скрипт не должен вызываться напрямую, а создан специально для использования внутри других скриптов.

- `"release:first": "npm run release --first-release"`,

Вызывается при первом формировании `Changelog`.
Не изменяет текущую версию.

- `"release:major": "npm run release --release-as major"`,

Повышает `major` версию приложения, генерирует `Changelog`.

- `"release:minor": "npm run release --release-as minor"`,

Повышает `minor` версию приложения, генерирует `Changelog`.

- `"release:patch": "npm run release --prerelease"`,

Повышает `patch` версию приложения, генерирует `Changelog`.

- `"husky:init": "npx husky install & npx husky set .husky/commit-msg \"npx commitlint --edit $1\""`,

Инициализирует `husky`, дополнительно создает `commit-msg` файл, который связывает `husky` с `commitlint`.

- `"prepare": "npm run husky:init`"

Скрипт `prepare` запускается при каждом запуске `npm install` или `yarn install`.
Нужен для того, чтобы `husky` был автоматически инициализирован у каждого разработчика,
работающего над проектом.
При использовании `yarn` необходимо заменить тело `script` на `yarn husky:init`.

## 2.Commitlint

Для конфигурации `commitlint` необходимо создать файл `commitlint.config.js`.

### Config:

```
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'merge']
        ],
        'scope-empty': [2, 'never'],
        'scope-min-length': [2, 'always', 3],
        'subject-min-length': [2, 'always', 15],
    }
};
```

### Rules:

Каждое правило определяется в качестве массива из 3 значений:

- level - задается числом от 0 до 2 (0 - off, 1 - warning, 2 - error);
- when - может быть `always` или `never` (`never` инвертирует правило);
- value - значение, которое будет применено к правилу;

В данной конфигурации используются следующие правила:

- `type-enum` - определяет доступные типы, с которых может начинаться `commit`;
- `scope-empty` - запрещает оставлять `scope` пустым;
- `scope-min-length` - определяет минимальную длину `scope` (3 символа);
- `subject-min-length` - определяет минимальную длину `subject` (3 символа); ;

Подробную информацию о доступных `rules` можно получить по ссылке: https://commitlint.js.org/#/reference-rules

Подробную информацию можно получить по ссылке: https://commitlint.js.org/#/

## 3.Husky

Позволяет конфигурировать список действий, которые будут совершены перед фиксацией `commit`.

В нашей конфигурации подразумевается проверка текста `commit` перед фиксацией с помощью `commitlint`.

Для инициализации `husky` необходимо запустить `script`:

```
npm run husky:init

or

yarn husky:init
```

Этот скрипт автоматически запускается при установке пакетов через `npm` или `yarn`.

Скрипт `husky:init` необходимо вызывать вручную, если скрипт `prepare` был добавлен уже после установки всех пакетов.

## 4.Standard-version

Предоставляет инструменты для управления версиями и генерации `Changelog`.

### Version control:

Версия приложения состоит из 3 частей.

```
[major].[minor].[patch]
```

- major - впервые обновляется до `1` при запуске проекта в `production`.
  Далее обновляется при внесении в код изменений, делающих невозможными обратную совместимость (breaking changes);
- minor - обновляется при завершении разработки какого-либо большого блока.
  Также может обновляться при завершении спринта.
- patch - обновляется при внесении небольших изменений.
  Чаще всего поднимается непосредственно перед слиянием `pull request` с `develop`.

Для исключения проблем соблюдения версионности настоятельно рекомендуется изменять версию только с помощью следующих
скриптов:

- release:major - увеличивает `major` версию и генерирует `changelog`;
- release:minor - увеличивает `minor` версию и генерирует `changelog`;
- release:patch - увеличивает `patch` версию и генерирует `changelog`;

Использовать данные скрипты необходимо непосредственно перед слиянием `pull request` с `develop`.
Убедитесь, что все комментарии уже исправлены и ветка готова к слиянию.
Также убедитесь, что в ветке, в которой Вы находитесь уже содержится весь актуальный код из ветки `develop`.
Рекомендуется дать обязанность по контролю версий одному разработчику для избежания конфликтов.

### Changelog

Для первой генерации `Changelog` можно использовать скрипт `release:first`.
Этот скрипт сгенерирует `Changelog` на основании прошлых коммитов без изменения версии.

Для генерации `Changelog` с изменением версии необходимо использовать одну из команд 
`release:major`, `release:minor` или `release:patch`.

В конфигурации по умолчанию подразумевается внесение в `changelog` только коммитов с типами `feat` и `fix`.

Для кастомизации необходимо создать файл `.versionrc.js`.

```
module.exports = {
    "types": [
      {
        "type": "Build",
        "section": "Build"
      },
      {
        "type": "ci",
        "section": "CI"
      },
      {
        "type": "docs",
        "section": "Docs"
      },
      {
        "type": "feat",
        "section": "Features"
      },
      {
        "type": "fix",
        "section": "Bug Fixes"
      },
      {
        "type": "perf",
        "section": "Performance"
      },
      {
        "type": "refactor",
        "section": "Refactor"
      },
      {
        "type": "style",
        "section": "Style changes",
      },    
      {
        "type": "test",
        "section": "Test",
        "hidden":true
      },
    ]
}
```

В данном файле можно объявить коммиты какого типа должны попасть в `changelog`.
Также можно задать название каждой секции с помощью поля `section`.
Поле `hidden` позволяет скрыть секцию в `changelog`.

## 5.Commit structure

После завершения настройки все разработчики будут обязаны соблюдать строгую структуру при оформлению каждого коммита.

### `Commit` должен состоять из следующих частей:

- type - находится в самом начале, определяет тип фиксации;

- scope - находится сразу после `type`, оборачивается в круглые скобки.
  Характеризует фрагмент кода, который затронули изменения(components, api, web3 ...).
  Чаще всего описывается одним словом.;

- subject - Краткое описание внесенных изменений.
  Находится сразу после `scope`.
  Отделяется знаком `:` и одним пробелом;

- header - содержит в себе `type`, `scope` и `subject`. Все поля `header` обязательны для заполнения.

- body - находится ниже `header`, отделяется одной пустой строкой.
  Содержит подробное описание внесенных изменений.
  Поле является необязательным, но его необходимо заполнять, если информация не вместилась в `subject`.

- footer - находится ниже `body`, отделяется одной пустой строкой.
  Следует использовать для указания внешних ссылок, контекста или другой мета информации.
  Поле является необязательным.

### Schema:

```
[type]([scope]): [subject]

[body]

[footer]
```

### Usage:

```
// добавляем нужные файлы (в данном случае все)
git add .
 
// вызываем команду инициализации коммита
git commit
 
// Далее вводим type, scope, subject, также можно добавить body и footer
[type]([scope]): [subject]
 
[body]

[footer]

// пример заполнения 

feat(api): api module implemented

Api module  created. Api plugin created. Profile and auth controllers created

Axios documentation: https://www.npmjs.com/package/axios
```
