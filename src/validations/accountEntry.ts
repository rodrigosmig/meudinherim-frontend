import * as yup from 'yup';

export const createEntryValidation = yup.object().shape({
  account_id: yup.number().integer("Conta inválida").typeError("O campo conta é inválido"),
  date: yup.date().typeError("O campo data é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é obrigatório")
})

export const editEntryValidation = yup.object().shape({
  date: yup.date().typeError("O campo data é obrigatório"),
  category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria é inválido"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é obrigatório")
});

export const transferValidation = yup.object().shape({
  date: yup.date().typeError("O campo vencimento é obrigatório"),
  description: yup.string().required("O campo descrição é obrigatório").min(3, "O campo descrição deve ter no mínimo 3 caracteres"),
  value: yup.number().positive("O valor deve ser maior que zero").typeError("O campo valor é inválido"),
  source_category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria de origem é inválido"),
  destination_category_id: yup.number().integer("Categoria inválida").typeError("O campo categoria de destino é inválido"),
  source_account_id: yup.number().integer("Categoria inválida").typeError("O campo conta de origem é inválido"),
  destination_account_id: yup.number().integer("Categoria inválida").typeError("O campo conta de destino é inválido"),
})