import {
  Box,
  Title,
  TextInput,
  Button,
  type TextInputProps,
} from '@markfoster314/marduk';

export interface AuthFormField {
  id: string;
  name: string;
  type: TextInputProps['type'];
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface AuthFormLink {
  text: string;
  onClick: () => void;
}

interface AuthFormTemplateProps {
  title: string;
  fields: AuthFormField[];
  submitButtonText: string;
  links?: AuthFormLink[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
}

export function AuthFormTemplate({
  title,
  fields,
  submitButtonText,
  links,
  onSubmit,
  isLoading = false,
}: AuthFormTemplateProps) {
  return (
    <Box className="auth-form">
      <Title preset={['secondaryDark']} level={1}>
        {title}
      </Title>
      <form onSubmit={onSubmit}>
        {fields.map((field) => (
          <Box key={field.id} className="form-group">
            <TextInput
              label={field.label}
              type={field.type}
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              required={field.required ?? false}
            />
          </Box>
        ))}
        <Button
          preset={['secondaryDark']}
          type="submit"
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : submitButtonText}
        </Button>
      </form>
      {links && links.length > 0 && (
        <Box className="auth-links">
          {links.map((link, index) => (
            <Button
              as="a"
              key={index}
              type="button"
              className="link-button"
              onClick={link.onClick}
            >
              {link.text}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
