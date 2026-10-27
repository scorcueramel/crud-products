import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { index, store, update } from "@/routes/users";

import type { EditableUser, Role } from "@/types/user-management";

interface Props {
    user?: EditableUser;
    roles: Role[];
}

export default function UserForm({ user, roles }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        password: "",
        password_confirmation: "",
        roles: user?.roles ?? ([] as string[]),
    });

    function toggleRole(roleName: string, checked: boolean) {
        setData(
            "roles",
            checked
                ? [...data.roles, roleName]
                : data.roles.filter((role) => role !== roleName),
        );
    }

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const options = {
            onFinish: () => {
                reset("password", "password_confirmation");
            },
        };

        if (user) {
            put(update(user.id).url, options);
        } else {
            post(store().url, options);
        }
    }

    return (
        <form onSubmit={submit} className="max-w-2xl space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>

                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    maxLength={255}
                    required
                />

                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>

                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                />

                {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>

                <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    required={!user}
                />

                {user && (
                    <p className="text-xs text-muted-foreground">
                        Dejar vacío para conservar la contraseña actual.
                    </p>
                )}

                {errors.password && (
                    <p className="text-sm text-destructive">
                        {errors.password}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password_confirmation">
                    Confirmar contraseña
                </Label>

                <Input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    required={!user || data.password.length > 0}
                />

                {errors.password_confirmation && (
                    <p className="text-sm text-destructive">
                        {errors.password_confirmation}
                    </p>
                )}
            </div>

            <fieldset className="space-y-3 rounded-md border p-4">
                <legend className="px-2 font-medium">Roles del usuario</legend>

                {roles.map((role) => (
                    <div key={role.id} className="flex items-center gap-3">
                        <Checkbox
                            id={`role-${role.id}`}
                            checked={data.roles.includes(role.name)}
                            onCheckedChange={(checked) =>
                                toggleRole(role.name, checked === true)
                            }
                        />

                        <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
                    </div>
                ))}

                {errors.roles && (
                    <p className="text-sm text-destructive">{errors.roles}</p>
                )}

                {Object.entries(errors)
                    .filter(([key]) => key.startsWith("roles."))
                    .map(([key, message]) => (
                        <p key={key} className="text-sm text-destructive">
                            {message}
                        </p>
                    ))}
            </fieldset>

            <div className="flex gap-3">
                <Button type="submit" disabled={processing} className="cursor-pointer">
                    {processing
                        ? "Guardando..."
                        : user
                          ? "Actualizar usuario"
                          : "Crear usuario"}
                </Button>

                <Button variant="outline" asChild>
                    <Link href={index().url}>Cancelar</Link>
                </Button>
            </div>
        </form>
    );
}
