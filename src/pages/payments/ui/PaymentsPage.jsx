import { useState, useEffect } from 'react';
import { Header } from '@widgets/header';
import { Card, CardHeader, CardTitle, CardContent } from '@shared/ui/Card';
import { Button } from '@shared/ui/Button';
import { Loading } from '@shared/ui/Loading';
import { paymentApi } from '@entities/payment/api/paymentApi';
import { formatCurrency, formatDate } from '@shared/lib/utils';
import { toast } from '@shared/lib/toast';
import { useAuthStore } from '@entities/user/model/store';
import { ROLES } from '@shared/config/constants';
import { Modal } from '@shared/ui/Modal';
import { Input } from '@shared/ui/Input';

export const PaymentsPage = () => {
  const { user } = useAuthStore();
  const [payments, setPayments] = useState([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const params = { page: 0, size: 20 };
      const [paymentsData, balanceData] = await Promise.all([
        user?.role === ROLES.CLIENT ? paymentApi.getClient(params) : paymentApi.getMy(params),
        user?.role === ROLES.FREELANCER ? paymentApi.getBalance() : Promise.resolve(0),
      ]);
      const paymentsList = paymentsData?.content || paymentsData || [];
      setPayments(Array.isArray(paymentsList) ? paymentsList : []);
      setBalance(typeof balanceData === 'number' ? balanceData : (balanceData?.balance || 0));
    } catch (err) {
      toast.error('Error loading data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    try {
      setIsProcessing(true);
      await paymentApi.createPayout({ amount: parseFloat(payoutAmount) });
      toast.success('Payout request created');
      setIsPayoutModalOpen(false);
      setPayoutAmount('');
      loadData();
    } catch (err) {
      toast.error('Error creating payout request');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-bg-body">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main mb-4 sm:mb-0">
              Payments
            </h1>
            {user?.role === ROLES.FREELANCER && balance > 0 && (
              <Button onClick={() => setIsPayoutModalOpen(true)}>
                Request Payout
              </Button>
            )}
          </div>

          {user?.role === ROLES.FREELANCER && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-text-muted">
                    Available Balance:
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(balance)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {!payments || payments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-text-muted text-lg">No payments yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {Array.isArray(payments) && payments.map((payment) => (
                <Card key={payment.id}>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <CardTitle>Payment #{payment.id}</CardTitle>
                      <span className="text-sm text-text-soft">
                        {formatDate(payment.createdAt)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-primary">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className="text-sm text-text-soft">
                        Status: {payment.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        title="Request Payout"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsPayoutModalOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePayout}
              isLoading={isProcessing}
              disabled={!payoutAmount || parseFloat(payoutAmount) <= 0}
            >
              Request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Available for payout: {formatCurrency(balance)}
          </p>
          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={payoutAmount}
            onChange={(e) => setPayoutAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </Modal>
    </>
  );
};

