module.exports = function (plop) {
  plop.setGenerator('controller', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'controller name please',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/controllers/{{name}}/{{name}}.controller.ts',
        templateFile: 'templates/controller.tsx.hbs',
      },
    ],
  });
};
