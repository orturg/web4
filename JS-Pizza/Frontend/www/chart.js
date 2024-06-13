document.addEventListener("DOMContentLoaded", function() {
    drawChart();

    function drawChart() {
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => {
            const basket = JSON.parse(localStorage.getItem('basket')) || [];
            const pizzaCounts = {};

            basket.forEach(item => {
                const pizzaName = item.pizzaName;
                if (!pizzaCounts[pizzaName]) {
                    pizzaCounts[pizzaName] = 0;
                }
                pizzaCounts[pizzaName] += item.amount;
            });

            const data = new google.visualization.DataTable();
            data.addColumn('string', 'Pizza');
            data.addColumn('number', 'Amount');

            for (let [pizzaName, amount] of Object.entries(pizzaCounts)) {
                data.addRow([pizzaName, amount]);
            };

            const barChartOptions = {
                title: 'Order',
                width: 600,
                height: 400,
                chartArea: {
                    left: 200,
                    right: 50,
                    top: 50,
                    bottom: 50,
                    width: '50%',
                    height: '70%'
                },
                hAxis: {
                    title: 'Amount',
                    format: '0',
                    viewWindow: {
                        min: 0
                    }
                },
                vAxis: {
                    title: 'Pizza'
                },
                colors: ['orange'],
                backgroundColor: '#efe6d6'
            };

            const pieChartOptions = {
                title: 'Order',
                width: 600,
                height: 400,
                chartArea: {
                    left: 200,
                    right: 50,
                    top: 50,
                    bottom: 50,
                    width: '50%',
                    height: '70%'
                },
                backgroundColor: '#efe6d6'
            };

            const chartBar = new google.visualization.BarChart(document.getElementById('bar-chart'));
            const chartPie = new google.visualization.PieChart(document.getElementById('pie-chart'));
            chartBar.draw(data, barChartOptions);
            chartPie.draw(data, pieChartOptions);
        });
    }
});
