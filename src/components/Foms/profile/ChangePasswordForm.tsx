import { useContext } from "react";
import { Flex, Stack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../../Inputs/Input";
import { AuthContext } from "../../../contexts/AuthContext";
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitButton } from "../../Buttons/Submit";
import { profileService } from "../../../services/ApiService/ProfileService";
import { getMessage } from "../../../utils/helpers";
import { changePasswordValidation } from "../../../validations/auth";

type PasswordFormData = {
    current_password: string
    password: string;
    password_confirmation: string;
}

export function ChangePasswordForm() {
    const { signOut } = useContext(AuthContext);

    const { register, handleSubmit, reset, setError, formState } = useForm({
        resolver: yupResolver(changePasswordValidation)
    });
    const { errors } = formState;

    const handleUpdatePassword: SubmitHandler<PasswordFormData> = async (values) => {
        try {
            await profileService.updatePassword(values);

            getMessage("Sucesso", "Senha alterada com sucesso");

            reset();

            signOut();

        } catch (error) {

            if (error.response.status === 422) {
                const data = error.response.data.errors;

                for (const key in data) {
                    data[key].map(error => {
                        setError(key, { message: error })
                    })
                }
            }
        }
    }

    return (
        <>
            <Flex
                as="form"
                w={['100%']}
                flexDir={["column"]}
                onSubmit={handleSubmit(handleUpdatePassword)}
            >
                <Stack spacing={[4]}>
                    <Input
                        name="current_password"
                        type="password"
                        label="Senha Atual"
                        error={errors.current_password}
                        {...register('current_password')}
                    />

                    <Input
                        name="password"
                        type="password"
                        label="Nova Senha"
                        error={errors.password}
                        {...register('password')}
                    />

                    <Input
                        name="password_confirmation"
                        type="password"
                        label="Confirmação"
                        error={errors.password_confirmation}
                        {...register('password_confirmation')}
                    />
                </Stack>

                <SubmitButton
                    mt={[6]}
                    label="Alterar Senha"
                    isLoading={formState.isSubmitting}
                />
            </Flex>

        </>
    )
}