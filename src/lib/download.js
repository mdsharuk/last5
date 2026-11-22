export function downloadFile(name, data, type) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function exportPaymentsCsv(orders, today) {
  const rows = [
    ['Order', 'Date', 'Food subtotal BDT', 'Customer fee BDT', 'Total charged BDT', 'Payment status', 'Refund status', 'Confirmed refund BDT'],
    ...orders.map((o) => [o.id, o.date, (o.subtotal / 100).toFixed(2), (o.fee / 100).toFixed(2), ((o.subtotal + o.fee) / 100).toFixed(2), o.payment, o.refund, (o.refundAmount / 100).toFixed(2)]),
  ];
  const safe = (x) => '"' + String(x).replace(/^[=+\-@]/, "'$&").replaceAll('"', '""') + '"';
  downloadFile('Last5_Payments_' + today + '.csv', '\ufeff' + rows.map((r) => r.map(safe).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
}
