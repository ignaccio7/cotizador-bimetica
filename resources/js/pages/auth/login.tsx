import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    return (
        <>
            <Head title="Iniciar Sesión | BIMETICA" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-bold text-foreground">
                                Correo Electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="usuario@bimetica.com"
                                className="h-10"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold text-foreground">
                                Contraseña
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="••••••••"
                                className="h-10"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full h-10 font-bold bg-[#003e65] hover:bg-[#00253d] text-white shadow-sm cursor-pointer transition-colors"
                            tabIndex={3}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            <span>Iniciar Sesión</span>
                        </Button>
                    </div>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Iniciar Sesión',
    description: 'Sistema Cotizador — Ingrese sus credenciales',
};
