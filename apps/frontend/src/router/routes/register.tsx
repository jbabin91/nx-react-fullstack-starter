import { zodResolver } from '@hookform/resolvers/zod';
import { type RegisterInput, registerUserSchema } from '@repo/db';
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
import { FileRoute, Link, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

import { trpc } from '../../libs';

export const Route = new FileRoute('/register').createRoute({
  component: RegisterComponent,
});

function RegisterComponent() {
  const router = useRouter();
  const { toast } = useToast();

  const { isPending, mutate: SignUpUser } = trpc.auth.register.useMutation({
    onError: (error) => {
      toast({ description: error.message, variant: 'destructive' });
    },
    onSuccess: (data) => {
      toast({
        description: 'Registration successful',
      });
      router.navigate({ to: '/login' });
    },
  });

  const form = useForm<RegisterInput>({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      passwordConfirm: '',
    },
    resolver: zodResolver(registerUserSchema),
  });

  const { isSubmitSuccessful } = form.formState;
  const reset = form.reset;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    SignUpUser(values);
    form.reset();
    router.invalidate();
    router.navigate({ from: '/register', to: '/profile' });
  };

  return (
    <section className="py-12 grid place-items-center">
      <Card className="w-[350px] bg-zinc-900">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-4 max-w-sm"
              onSubmit={form.handleSubmit(onSubmitHandler)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <span className="block">
                Already have an account?{' '}
                <Link className="text-blue-500" to="/login">
                  Login Here
                </Link>
              </span>
              <Button loading={isPending} type="submit">
                Sign Up
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}
