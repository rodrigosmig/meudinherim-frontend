import * as yup from 'yup';

export const loginValidation = yup.object().shape({
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
  password: yup.string().required("O campo senha é obrigatório").min(8, "O campo senha deve ter no mínimo 8 caracteres"),
});

export const registerValidation = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
  password: yup.string().required("O campo senha é obrigatório").min(8, "O campo senha deve ter no mínimo 8 caracteres"),
  password_confirmation: yup.string().oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais')
});

export const profileValidation = yup.object().shape({
  name: yup.string().required("O campo nome é obrigatório").min(3, "O campo nome deve ter no mínimo 3 caracteres"),
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido")
});

export const resendEmailVerificationValidation = yup.object().shape({
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
});

export const resetPasswordValidation = yup.object().shape({
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
  password: yup.string().required("O campo senha é obrigatório").min(8, "O campo senha deve ter no mínimo 8 caracteres"),
  password_confirmation: yup.string().oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais')
});

export const forgotPasswordValidation = yup.object().shape({
  email: yup.string().required("O campo email é obrigatório").email("E-mail inválido"),
});