import { api } from "./api";

export const validateCartItem = async (id_cliente, produto, quantidade = 1) => {
  const response = await fetch(`${api}/cart/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_cliente,
      id_produto: produto.id_produto,
      nome: produto.nome,
      preco: produto.preco,
      estoque: produto.estoque,
      quantidade,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.erro || "Erro ao validar produto.");
  return data;
};

export const submitCheckout = async (id_cliente, itens) => {
  const response = await fetch(`${api}/cart/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_cliente, id_endereco, itens }),
  });
  const data = await response.json();
  if (!response.ok) {
    const detalhe = data.detalhes ? `\n${data.detalhes.join("\n")}` : "";
    throw new Error((data.erro || "Erro no checkout.") + detalhe);
  }
  return data;
};