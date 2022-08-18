import * as yup from 'yup';

export const createValidation = yup.object().shape({
  due_date: yup.date().typeError("O campo vencimento é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").moreThan(0, "O campo categoria é inválido").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
  installment: yup.boolean(),
  installments_number: yup.number().when('installment', {
    is: true,
    then: yup.number().typeError("O número de parcelas é inválido")
      .min(2, 'O valor mínimo é 2.')
      .max(30, 'O valor máximo é 30.'),
  })
});

export const editValidation = yup.object().shape({
  due_date: yup.date().typeError("O campo vencimento é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
});

export const paymentValidation = yup.object().shape({
  paid_date: yup.date().typeError("O campo data de pagamento é obrigatório"),
  account_id: yup.number().integer("Conta inválida").moreThan(0, "Conta inválida").typeError("O campo conta é inválido"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
});

export const generatePaymentValidation = yup.object().shape({
  category_id: yup.number().integer("Categoria inválida").moreThan(0, "Categoria inválida").typeError("O campo categoria é inválido"),
});