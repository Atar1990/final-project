import React from 'react';
import { Bar } from 'react-chartjs-2';

const KpiChart = (props) => {
  // נתוני ה-KPI
  const kpiData = {
    labels: ['אטרקציות', '', 'בילויים', '', 'לינה', '', 'מזון', '', 'התארגנות', '', 'הימורים', ''],
    datasets: [
      {
        label: 'הוצאה בשקלים',
        data: [props.SumOfExpenseAtraction, props.AvgOfExpenseAtraction,props.SumOfExpenseParty 
          ,props.AvgOfExpenseParty,props.SumOfExpenseSleep,props.AvgOfExpenseSleep
          ,props.SumOfExpenseFood,props.AvgOfExpenseFood,props.SumOfExpenseDrugs,props.AvgOfExpenseDrugs
          ,props.SumOfExpenseCasino,props.AvgOfExpenseCasino], // ערכי ה-KPI
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 255, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 255, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 255, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 255, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 255, 255, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 255, 255, 0.6)'
        ],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <h4>הוצאות שלי vs הוצאות מקובלות</h4>
      <Bar
        data={kpiData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 13000,
              title: {
                display: true,
                text: 'הוצאה כספית',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default KpiChart;
