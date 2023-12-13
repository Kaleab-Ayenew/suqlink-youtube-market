import * as yup from 'yup';
import Router from 'next/router';
import type { SubmitHandler } from 'react-hook-form';
import type { ChapaPaymentInfo, RegisterUserInput } from '@/types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Form } from '@/components/ui/forms/form';
import Password from '@/components/ui/forms/password';
import { useModalAction } from '@/components/modal-views/context';
import Input from '@/components/ui/forms/input';
import client from '@/data/client';
import Button from '@/components/ui/button';
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern';
import { useState } from 'react';
import useAuth from './use-auth';
import { useTranslation } from 'next-i18next';
import { SpinnerLoader } from '../ui/loader/spinner/spinner';

const paymentInfoValidationSchema = yup.object().shape({
  phone_no: yup.string().max(20).required(),
});

export default function PaymentInfoForm({
  platform_id,
}: {
  platform_id: string;
}) {
  const { t } = useTranslation('common');
  const { openModal, closeModal } = useModalAction();
  const { authorize } = useAuth();
  let [serverError, setServerError] = useState<ChapaPaymentInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { mutate } = useMutation(client.users.get_payment_link, {
    onSuccess: (res) => {
      setLoading(false);
      window.location.assign(res.link);
      closeModal();
    },
    onError: (err: any) => {
      console.log(err.response.data, 'error');
      setServerError(err.response.data);
    },
  });
  const onSubmit: SubmitHandler<ChapaPaymentInfo> = (data) => {
    setLoading(true);
    data.platform_id = platform_id;

    mutate(data);
  };

  return (
    <div className="bg-light px-6 pb-8 pt-10 dark:bg-dark-300 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              Complete Purchase
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              Please enter your phone number:
              {/* <button
                onClick={() => openModal('LOGIN_VIEW')}
                className="inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              >
                {t('text-login')}
              </button> */}
            </div>
          </div>

          <Form<ChapaPaymentInfo>
            onSubmit={onSubmit}
            validationSchema={paymentInfoValidationSchema}
            serverError={serverError}
            className="space-y-4 lg:space-y-5"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  placeholder="Enter Phone Number: 0900..."
                  inputClassName="bg-light dark:bg-dark-300"
                  type="text"
                  {...register('phone_no')}
                  error={errors.phone_no?.message}
                />

                <Button
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Continue to Payment'}
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
