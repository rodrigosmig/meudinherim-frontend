import Text from "@/components/primitives/text";
import { Card } from "@/components/card";

import LoginForm from "./login-form";

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col gap-4 items-center justify-center">
      <Text variant="heading-large">MEU DINHEIRIM</Text>
      <Card.Root className="w-full max-w-md">
        <LoginForm />
      </Card.Root>
    </div>
  );
}
