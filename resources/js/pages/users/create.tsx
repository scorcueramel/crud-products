import { Head } from "@inertiajs/react";

import UserForm from "@/components/users/user-form";
import { index } from "@/routes/users";

import type { Role } from "@/types/user-management";

interface Props {
    roles: Role[];
}

export default function CreateUser({ roles }: Props) {
    return (
        <>
            <Head title="Crear usuario" />

            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Crear usuario</h1>
                <UserForm roles={roles} />
            </div>
        </>
    );
}

CreateUser.layout = {
  breadcrumbs: [
    {
      title: "Usuarios",
      href: index().url,
    },
    {
      title: "Crear usuario",
      href: "#"
    }
  ]
}