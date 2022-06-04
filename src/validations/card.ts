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

