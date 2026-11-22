'use client';

import React from 'react';
import { Table } from 'antd';
import Icon from '@/lib/icons';
import { useApp } from '@/components/AppProvider';
import { PageHeading, Badge, Metric, Btn } from '@/components/account/AccountUI';
import { accountMoney, date } from '@/lib/format';
import { TODAY } from '@/lib/model';
import { exportPaymentsCsv } from '@/lib/download';
import { useTitle } from '@/lib/useTitle';

export default function PaymentsPage() {
  useTitle('Payments & refunds');
  const { s, site, setSite, showOrder, toast } = useApp();
  const orders = s.orders.filter((o) => o.customerId === s.profile.id);
  const paid = orders.filter((o) => o.payment === 'Paid').reduce((n, o) => n + o.subtotal + o.fee, 0);
  const refunded = orders.reduce((n, o) => n + (o.refund === 'Completed' ? o.refundAmount : 0), 0);
  const pending = orders.reduce((n, o) => n + (o.refund === 'Pending' ? o.requestedRefund : 0), 0);
  const tab = site.filtersAccount.payments || 'All payments';
  const list = orders.filter((o) => tab !== 'Refunds' || o.refund !== 'None');

  const columns = [
    {
      title: 'Order',
      dataIndex: 'id',
      render: (_, o) => (
        <>
          <button className="row-btn" onClick={() => showOrder(o.id)} type="button">{o.id}</button>
          <p className="tiny muted">{o.shopName}</p>
        </>
      ),
    },
    { title: 'Date', dataIndex: 'date', render: (d) => date(d) },
    { title: 'Paid amount', dataIndex: 'total', render: (_, o) => <span className="strong mono">{accountMoney(o.subtotal + o.fee, true)}</span> },
    { title: 'Payment', dataIndex: 'payment', render: (v) => <Badge value={v} /> },
    {
      title: 'Refund status',
      dataIndex: 'refund',
      render: (v, o) => (v === 'None' ? '—' : (
        <>
          <Badge value={v} />
          <p className="tiny muted" style={{ marginTop: 4 }}>{accountMoney(v === 'Completed' ? o.refundAmount : o.requestedRefund)}</p>
        </>
      )),
    },
    {
      title: '',
      key: 'action',
      render: (_, o) => (
        <button className="row-action" onClick={() => showOrder(o.id)} aria-label={`View payment for ${o.id}`} type="button"><Icon name="chevron" className="sm" /></button>
      ),
    },
  ];

  return (
    <>
      <PageHeading
        title="Payments & refunds"
        sub="A clear record of what you paid and what’s being returned."
        actions={<Btn icon="download" onClick={() => { exportPaymentsCsv(orders, TODAY); toast('Your download is ready.'); }}>Export records</Btn>}
      />
      <div className="metrics account-metrics">
        <Metric icon="wallet" value={accountMoney(paid)} label="Verified charges" />
        <Metric icon="check" value={accountMoney(refunded)} label="Completed refunds" />
        <Metric icon="clock" value={accountMoney(pending)} label="Refunds pending" />
      </div>
      <div className="notice"><Icon name="shield" className="sm" />Payments use the approved online gateway. Full card details and mobile-wallet secrets are not saved in your Last5 account.</div>
      <section className="panel table-panel">
        <div className="tabs">
          {['All payments', 'Refunds'].map((x) => (
            <button className={`tab ${tab === x ? 'active' : ''}`} onClick={() => setSite({ filtersAccount: { ...site.filtersAccount, payments: x } })} type="button" key={x}>{x}</button>
          ))}
        </div>
        <div className="table-wrap">
          <Table
            className="l5-table"
            columns={columns}
            dataSource={list}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      </section>
    </>
  );
}
