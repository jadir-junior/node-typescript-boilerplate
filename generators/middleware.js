module.exports = function (plop) {
  plop.setGenerator('Middleware', {
    description: 'application middleware logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'middleware name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/middlewares/{{name}}/{{name}}.middleware.ts',
        templateFile: 'templates/middleware.tsx.hbs',
      },
      {
        type: 'add',
        path: '../src/middlewares/{{name}}/{{name}}.middleware.test.ts',
        templateFile: 'templates/test.tsx.hbs',
      },
    ],
  });
};
