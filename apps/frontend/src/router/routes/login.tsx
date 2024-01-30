import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginInput } from '@repo/db';
import { loginUserSchema } from '@repo/db';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast,
} from '@repo/ui';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { trpc } from '../../libs';
import { useAuthStore } from '../../store';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
}).update({
  component: LoginComponent,
});

function LoginComponent() {
  const router = useRouter();
  const { toast } = useToast();
  const search = Route.useSearch();
  const { setAuthUser } = useAuthStore();

  const { isPending, mutate: loginUser } = trpc.auth.login.useMutation({
    onError: (error) => {
      toast({ description: error.message, variant: 'destructive' });
    },
    onSuccess: (data) => {
      toast({ description: 'Logged in successfully' });
      setAuthUser(data.user);
      if (search.redirect && search.redirect !== '/login') {
        router.history.push(search.redirect);
        router.navigate({ to: search.redirect });
      } else {
        router.navigate({ to: '/' });
      }
    },
  });

  const form = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginUserSchema),
  });

  const { isSubmitSuccessful } = form.formState;
  const reset = form.reset;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  // Ah, the subtle nuances of client side auth. 🙄
  // useLayoutEffect(() => {
  //   if (status === 'loggedIn' && search.redirect) {
  //     router.history.push(search.redirect);
  //   }
  // }, [status, search.redirect]);

  function onSubmit(values: LoginInput) {
    loginUser(values);
    form.reset();
    router.invalidate();
  }

  return (
    <section className="grid place-items-center py-12">
      <Card className="w-[350px] bg-zinc-900">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="max-w-sm space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button loading={isPending} type="submit">
                Login
              </Button>
              <span className="block">
                Need an account?{' '}
                <Link className="text-blue-500" to="/register">
                  Sign Up Here
                </Link>
              </span>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
