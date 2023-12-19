import cn from 'classnames';
import { useTranslation } from 'next-i18next';

export default function Copyright({ className }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation('common');
  return (
    <div className={cn('tracking-[0.2px]', className)}>
      <ul style={{ textAlign: 'center', fontSize: '13px', padding: '9px' }}>
        <li>
          <strong>Contact us about anything:</strong>
        </li>{' '}
        <li style={{ color: '#8a8888', margin: '3px' }}>
          Phone: +251953640216
        </li>{' '}
        <li style={{ color: '#8a8888', margin: '3px' }}>
          Telegram: <a href="https://t.me/kal_suqlink">@kal_suqlink</a>
        </li>{' '}
        <li style={{ color: '#8a8888' }}>Email: info@suqlink.com</li>
        {'\n\n'}
      </ul>
    </div>
  );
}
