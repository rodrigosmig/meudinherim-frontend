import Modal from "@/components/modal";
import { Input } from "@/components/primitives/input";
import InputDate from "@/components/primitives/input-date";
import InputMoney from "@/components/primitives/input-money";
import Select from "@/components/primitives/select";
import { SelectItem } from "@/components/primitives/select-item";
import { useContas } from "@/hooks/use-contas";

type AddLancamentoContaFormProps = {
  isOpen: boolean;
  onClose: () => void;
}

export default function LancamentoContaForm({ isOpen, onClose }: AddLancamentoContaFormProps) {
  const { contas, isLoading: isContasLoading } = useContas();


  return (
    <Modal open={isOpen} onOpenChange={onClose} title="Adicionar lançamento" >
      <form className="space-y-4">
        <Select placeholder="Selecione uma conta">
          {contas.map(conta => (
            <SelectItem key={conta.uuid} text={conta.nome} value={conta.uuid} />
          ))}
        </Select>
        <InputDate
          placeholder="Selecione uma data"
          label="Data"
        />
        <Input label="Descrição" placeholder="Descrição" />
        <InputMoney label="Valor" />
      </form>
    </Modal>
  )
}