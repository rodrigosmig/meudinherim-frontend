
export default async function Page({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;

  if (!token) {
    // Redireciona ou mostra erro
    return <p>Token não encontrado na URL.</p>;
  }

  // Chame sua API externa aqui usando o token
  // const result = await fetch(...);

  return <p>Conta confirmada com sucesso!</p>;
}