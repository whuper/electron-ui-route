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
        tooltip: '5500 words',
        icon: 'star'
      },
      material: {
        path: 'modules/material',
        name: 'MaterialModule',
        url: '/app/material',
        state: 'app.material',
        label: 'Material',
        tooltip: 'Material DEMO',
        icon: 'face'
      },      
      materialDireDemo: {
        path: 'modules/materialDireDemo',
        name: 'MaterialDireDemoModule',
        url: '/app/materialDireDemo',
        state: 'app.materialDireDemo',
        label: 'MaterialDireDemo',
        tooltip: 'MaterialDireDemo DEMO',
        icon: 'face'
      },
	   materialDireDemo2: {
        path: 'modules/materialDireDemo2',
        name: 'MaterialDireDemo2Module',
        url: '/app/materialDireDemo2',
        state: 'app.materialDireDemo2',
        label: 'MaterialDireDemo2',
        tooltip: 'MaterialDireDemo DEMO2',
        icon: 'face'
      }

    }
  }
})()
