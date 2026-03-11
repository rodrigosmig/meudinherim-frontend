import { cn } from "@/helpers/string-helper";
import { ComponentProps } from "react";

interface AvatarProps extends ComponentProps<"img"> {
  name?: string;
  src?: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  ring?: boolean;
  ringColor?: string;
}

export function Avatar({
  name,
  src,
  size = 40,
  backgroundColor = '8b5cf6',
  textColor = 'ffffff',
  className = '',
  ring = false,
  ringColor = 'violet-500',
  alt,
  ...props
}: AvatarProps) {
  // Converte o nome para o formato esperado pela API (espaços para +)
  const formattedName = name?.replace(/\s+/g, '+') || 'User';

  // Constrói a URL do avatar apenas se não houver src
  const avatarUrl = src || `https://ui-avatars.com/api/?name=${formattedName}&background=${backgroundColor}&color=${textColor}&size=${size}`;

  // Classes base para o avatar
  const baseClasses = cn(
    'rounded-full object-cover',
    ring && `ring-2 ring-${ringColor}`,
    className
  );

  // Define tamanho inline para garantir que a imagem tenha o tamanho correto
  const sizeStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    minHeight: size
  };

  const altText = alt || `Avatar de ${name || 'usuário'}`;

  return (
    <img
      src={avatarUrl}
      alt={altText}
      className={baseClasses}
      style={sizeStyle}
      {...props}
    />
  );
};