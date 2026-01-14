
import React from "react";

import { DashboardAdmin } from "./DashboardAdmin";
import { DashboardProfissional } from "./DashboardProfissional";
import { DashboardFuncionario } from "./DashboardFuncionario";




function DashboardSelector() {
const tipoUsuario = localStorage.getItem("usuario_tipo");
if (tipoUsuario === "admin") {
  <DashboardAdmin />
} else if (tipoUsuario === "funcionario") {
  <DashboardFuncionario />
} else if (tipoUsuario === "profissional") {
  <DashboardProfissional />
}
return <div>Tipo de usuário desconhecido.</div>;

};
export default DashboardSelector;

