import { Link, useForm } from "@inertiajs/react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { index, store, update } from "@/routes/roles";

import type { EditableRole, PermissionOption } from "@/types/role-managements";
import { Key } from "lucide-react";

interface Props {
    role?: EditableRole;
    permissions: PermissionOption[];
}

const moduleLabels: Record<string, string> = {
    products: "Products",
    users: "Usuarios",
    roles: "Roles",
};

export default function RoleForm({ role, permissions }: Props) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name ?? "",
        permissions: role?.permissions ?? ([] as string[]),
    });

    const groupedPermissions = permissions.reduce<
        Record<string, PermissionOption[]>
    >((groups, permission) => {
        const module = permission.name.split(".")[0] || "otros";

        if (!groups[module]) {
            groups[module] = [];
        }

        groups[module].push(permission);

        return groups;
    }, {});

    function togglePermission(name: string, checked: boolean) {
        setData(
            "permissions",
            checked
                ? [...new Set([...data.permissions, name])]
                : data.permissions.filter((item) => item !== name),
        );
    }

    function toggleModule(
        modulePermissions: PermissionOption[],
        checked: boolean,
    ) {
        const names = modulePermissions.map((item) => item.name);
        const selected = new Set(names);

        setData(
            "permissions",
            checked
                ? [...new Set([...data.permissions, ...names])]
                : data.permissions.filter((name) => !selected.has(name)),
        );
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (role) {
            put(update(role.id).url);
        } else {
            post(store().url);
        }
    }

    return (
        <form onSubmit={submit} className="max-w-3xl space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre del rol</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(event) => setData("name", event.target.value)}
                    minLength={2}
                    maxLength={125}
                    required
                />
                {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                )}
            </div>
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Permisos</h2>
                {Object.entries(groupedPermissions).map(
                    ([module, modulePermissions]) => {
                        const allSelected = modulePermissions.every(
                            (permission) =>
                                data.permissions.includes(permission.name),
                        );

                        return (
                            <fieldset
                                key={module}
                                className="space-y-4 rounded-lg border p-4"
                            >
                                <legend className="px-2 font-semibold">
                                    {moduleLabels[module] ?? module}
                                </legend>
                                <div className="flex items-center gap-3 border-b pb-3">
                                    <Checkbox
                                        id={`all-${module}`}
                                        checked={allSelected}
                                        onCheckedChange={(checked) =>
                                            toggleModule(
                                                modulePermissions,
                                                checked === true,
                                            )
                                        }
                                    />
                                    <Label htmlFor={`all-${module}`}>
                                        Seleccionar todos
                                    </Label>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {modulePermissions.map((permission) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-center gap-3"
                                        >
                                            <Checkbox
                                                id={`permission-${permission.id}`}
                                                checked={data.permissions.includes(
                                                    permission.name,
                                                )}
                                                onCheckedChange={(checked) =>
                                                    togglePermission(
                                                        permission.name,
                                                        checked === true,
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`permission-${permission.id}`}
                                            >
                                                {permission.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>
                        );
                    },
                )}
                {errors.permissions && (
                    <p className="text-sm text-destructive1">
                        {errors.permissions}
                    </p>
                )}
                {Object.entries(errors)
                    .filter(([key]) => key.startsWith("permissions."))
                    .map(([key, message]) => (
                        <p key={key} className="text-sm text-destructive">
                            {message}
                        </p>
                    ))}
            </div>
            <div className="flex gap-3">
                <Button type="submit" disabled={processing} className="cursor-pointer">
                    {processing
                        ? "Guardando..."
                        : role
                          ? "Actualizar rol"
                          : "Crear rol"}
                </Button>
                <Button variant="outline" asChild className="cursor-pointer">
                    <Link href={index().url}>Cancelar</Link>
                </Button>
            </div>
        </form>
    );
}
