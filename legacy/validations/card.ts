import * as yup from 'yup';

export const createValidation = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
  pay_day: yup.number().typeError("O campo dia do pagamento é inválido")
    .min(1, 'O valor mínimo é 1.')
    .max(31, 'O valor máximo é 31.'),
  closing_day: yup.number().typeError("O campo dia do fechamento é inválido")
    .min(1, 'O valor mínimo é 1.')
    .max(31, 'O valor máximo é 31.'),
  credit_limit: yup.number().positive("O campo limite de crédito deve ser maior que zero")
    .typeError("O campo limite de crédito é obrigatório")
});

export const editValidation = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
  pay_day: yup.number().typeError("O campo dia do pagamento é inválido")
    .min(1, 'O valor mínimo é 1.')
    .max(31, 'O valor máximo é 31.'),
  closing_day: yup.number().typeError("O campo dia do fechamento é inválido")
    .min(1, 'O valor mínimo é 1.')
    .max(31, 'O valor máximo é 31.'),
  credit_limit: yup.number().positive("O campo limite de crédito deve ser maior que zero")
    .typeError("O campo limite de crédito é obrigatório")
});

export const partialPayment = yup.object().shape({
  date: yup.date().typeError("O campo data é obrigatório"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
  account_id: yup.number().integer("Conta inválida").moreThan(0, "O campo conta é inválido").typeError("O campo conta é inválido"),
  card_id: yup.number().integer("Cartão de crédito inválida").moreThan(0, "O campo cartão de crédito é inválido").typeError("O campo cartão de crédito é inválido"),
  income_category_id: yup.number().integer("Categoria inválida").moreThan(0, "O campo categoria de entrada é inválido").typeError("O campo categoria de entrada é inválido"),
  expense_category_id: yup.number().integer("Categoria inválida").moreThan(0, "O campo categoria de saída é inválido").typeError("O campo categoria de saída é inválido"),
})
