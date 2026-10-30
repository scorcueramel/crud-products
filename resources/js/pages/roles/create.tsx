import { Head } from "@inertiajs/react";
import RoleForm from "@/components/roles/role-form";
import { index } from "@/routes/roles";
import type { PermissionOption } from "@/types/role-managements";

interface Props {
    permissions: PermissionOption[];
}

export default function CreateRole({ permissions }: Props) {
    return (
        <>
            <Head title="Crear rol" />
            <div className="space-y-6 p-6">
                <h1 className="text-2xl font-bold">Crear rol</h1>
                <RoleForm permissions={permissions} />
            </div>
        </>
    );
}

CreateRole.layout = {
    breadcrumbs: [
        { title: "Roles", href: index().url },
        { title: "Crear rol", href: "#" },
    ],
};
