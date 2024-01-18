import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@repo/ui';
import { FileRoute, useRouter } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = new FileRoute('/login')
  .createRoute({
    validateSearch: z.object({
      redirect: z.string().optional(),
    }),
  })
  .update({
    component: LoginComponent,
  });

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters long',
  }),
});
type Form = z.infer<typeof formSchema>;

function LoginComponent() {
  const router = useRouter();
  const { auth, status } = Route.useRouteContext({
    select: ({ auth }) => ({ auth, status: auth.status }),
  });
  const search = Route.useSearch();

  const form = useForm<Form>({
    defaultValues: {
      username: '',
    },
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: Form) {
    auth.login(values.username);
    router.invalidate();
  }

  // Ah, the subtle nuances of client side auth. 🙄
  useLayoutEffect(() => {
    if (status === 'loggedIn' && search.redirect) {
      router.history.push(search.redirect);
    }
  }, [status, search.redirect]);

  return status === 'loggedIn' ? (
    <div>
      Logged in as <strong>{auth.username}</strong>
      <div className="h-2" />
      <Button
        onClick={() => {
          auth.logout();
          router.invalidate();
        }}
      >
        Logout
      </Button>
      <div className="h-2" />
    </div>
  ) : (
    <div className="p-2">
      <div>You must log in!</div>
      <div className="h-2" />
      <Form {...form}>
        <form
          className="space-y-4 max-w-sm"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
    </div>
  );
}
