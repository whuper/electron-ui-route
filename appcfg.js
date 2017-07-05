(function () {
  module.exports = {
    defaultModule: 'words',
    modules: {
/*      todo: {
        path: 'modules/todo',
        name: 'TodoModule',
        url: '/app/todo/view',
        state: 'app.todo',
        label: 'Todos',
        sref: '.todo.view',
        tooltip: 'Access your todos',
        icon: 'toc'
      },
      activities: {
        path: 'modules/activities',
        name: 'ActivityModule',
        url: '/app/activities/view',
        state: 'app.activities',
        label: 'Activities',
        sref: '.activities.view',
        tooltip: 'Access your activities',
        icon: 'import_export'
      },*/
      words: {
        path: 'modules/words',
        name: 'WordsModule',
        url: '/app/words',
        state: 'app.words',
        label: 'Words',
        sref: '.words',
        tooltip: '5500 words',
        icon: 'label_important'
      },
      material: {
        path: 'modules/material',
        name: 'MaterialModule',
        url: '/app/material',
        state: 'app.material',
        label: 'Material',
        sref: '.material',
        tooltip: 'Material DEMO',
        icon: 'toc'
      }
    }
  }
})()
