$(document).ready(function() {
    $.getJSON("data.json", function(data) {
        function updatePlot() {
            var gpt4PromptPrice = parseFloat($('#gpt4-prompt-price').val()) / 1000000;
            var gpt4CompletionPrice = parseFloat($('#gpt4-completion-price').val()) / 1000000;
            var gpt3PromptPrice = parseFloat($('#gpt3-prompt-price').val()) / 1000000;
            var gpt3CompletionPrice = parseFloat($('#gpt3-completion-price').val()) / 1000000;
            var l3_8bPromptPrice = parseFloat($('#l3-8b-prompt-price').val()) / 1000000;
            var l3_8bCompletionPrice = parseFloat($('#l3-8b-completion-price').val()) / 1000000;
            var l3_70bPromptPrice = parseFloat($('#l3-70b-prompt-price').val()) / 1000000;
            var l3_70bCompletionPrice = parseFloat($('#l3-70b-completion-price').val()) / 1000000;

            var x = [];
            var y = [];
            var text = [];
            var labels = [];
            var colors = [];

            var color_dict = {
                'GPT-4': '#1b9e77', // blue
                'GPT-3.5': '#1b9e77', // blue
                'LDB (GPT-4)': '#d95f02', // orange
                'LDB (GPT-3.5)': '#d95f02', // orange
                'Escalation': '#7570b3', // green
                'Reflexion (GPT-4)': '#d95f02', // orange
                "LATS (GPT-4, GPT-3.5)": '#d95f02', // orange
                "Retry (GPT-4)": '#7570b3', // green
                "Warming (GPT-4-1step)": '#1b9e77', // blue
                "LDB (Reflexion, GPT-4)": '#d95f02', // orange
                "LDB (GPT-4, GPT-3.5)": '#d95f02', // orange
                "LATS (GPT-4)": '#d95f02', // orange
                "LATS (GPT-3.5)": '#d95f02', // orange
                "LDB (Reflexion, GPT-3.5)": '#d95f02', // orange
                "Warming (GPT-4)": '#7570b3', // green
                "Retry (GPT-4)": '#7570b3', // green
                "Warming (GPT-4-1step)": '#1b9e77', // blue
                "LDB (GPT-4, Reflexion)": '#d95f02', // orange
                "LDB (GPT-3.5, GPT-4)": '#d95f02', // orange
                "LDB (GPT-3.5, Reflexion)": '#d95f02', // orange
                "Reflexion (GPT-3.5)": '#d95f02', // orange
                "Repeat (GPT-3.5)": '#7570b3', // green
                "Warming (GPT-4)": '#7570b3', // green
            };

            var gpt4_cost = 0;
            var gpt3_cost = 0;
            var reflexion_cost = 0;

            data.forEach(item => {
                if (item.strategy_renamed === 'GPT-4') {
                    gpt4_cost = item.mean_prompt_tokens * gpt4PromptPrice + item.mean_completion_tokens * gpt4CompletionPrice;
                } else if (item.strategy_renamed === 'GPT-3.5') {
                    gpt3_cost = item.mean_prompt_tokens * gpt3PromptPrice + item.mean_completion_tokens * gpt3CompletionPrice;
                } else if (item.strategy_renamed === 'Reflexion (GPT-4)') {
                    reflexion_cost = item.mean_prompt_tokens * gpt4PromptPrice + item.mean_completion_tokens * gpt4CompletionPrice;
                }
            });

            data.forEach(item => {
                var cost = 0;
                if (item.strategy_renamed === 'LDB (GPT-3.5)') {
                    cost = gpt3_cost + item.mean_prompt_tokens * gpt3PromptPrice + item.mean_completion_tokens * gpt3CompletionPrice;
                } else if (item.strategy_renamed === 'LDB (GPT-4)') {
                    cost = gpt4_cost + item.mean_prompt_tokens * gpt4PromptPrice + item.mean_completion_tokens * gpt4CompletionPrice;
                } else if (item.strategy_renamed === 'LDB (GPT-4, GPT-3.5)') {
                    cost = gpt4_cost + item.mean_prompt_tokens * gpt3PromptPrice + item.mean_completion_tokens * gpt3CompletionPrice;
                } else if (item.strategy_renamed === 'LDB (Reflexion, GPT-3.5)') {
                    cost = reflexion_cost + item.mean_prompt_tokens * gpt3PromptPrice + item.mean_completion_tokens * gpt3CompletionPrice;
                } else if (item.strategy_renamed === 'LDB (Reflexion, GPT-4)') {
                    cost = reflexion_cost + item.mean_prompt_tokens * gpt4PromptPrice + item.mean_completion_tokens * gpt4CompletionPrice;
                } else if (item.strategy_renamed === 'Escalation') {
                    cost = item.mean_l3_8b_prompt_tokens * l3_8bPromptPrice + item.mean_l3_8b_completion_tokens * l3_8bCompletionPrice + item.mean_l3_70b_prompt_tokens * l3_70bPromptPrice + item.mean_l3_70b_completion_tokens * l3_70bCompletionPrice + item.mean_gpt_4_prompt_tokens * gpt4PromptPrice + item.mean_gpt_4_completion_tokens * gpt4CompletionPrice + item.mean_gpt_35_prompt_tokens * gpt3PromptPrice + item.mean_gpt_35_completion_tokens * gpt3CompletionPrice;
                } else if (item.model === 'GPT-4') {
                    cost = item.mean_prompt_tokens * gpt4PromptPrice + item.mean_completion_tokens * gpt4CompletionPrice;
                } else if (item.model === 'GPT-3.5') {
                    cost = item.mean_prompt_tokens * gpt3PromptPrice + item.mean_completion_tokens * gpt3CompletionPrice;
                }
                x.push(cost);
                y.push(item.mean_accuracy);
                text.push(item.strategy_renamed);
                labels.push(item.strategy_renamed);
                colors.push(color_dict[item.strategy_renamed] || 'black');
            });

            // Pareto Curve Calculation
            var pareto_x = [];
            var pareto_y = [];
            var pareto_points = [];

            data.forEach((item, index) => {
                pareto_points.push({ cost: x[index], accuracy: y[index] });
            });

            pareto_points.sort((a, b) => a.cost - b.cost);

            var max_acc = 0;
            pareto_points.forEach(point => {
                if (point.accuracy >= max_acc) {
                    pareto_x.push(point.cost);
                    pareto_y.push(point.accuracy);
                    max_acc = point.accuracy;
                }
            });

            function isLeftTurn(p, q, r) {
                return (q.cost - p.cost) * (r.accuracy - p.accuracy) - (q.accuracy - p.accuracy) * (r.cost - p.cost) > 0;
            }

            // Convex Hull Calculation
            var convex_hull = [];
            var pareto_length = pareto_x.length;
            for (var i = pareto_length - 1; i >= 0; i--) {
                var point = { cost: pareto_x[i], accuracy: pareto_y[i] };
                while (convex_hull.length >= 2 && !isLeftTurn(convex_hull[convex_hull.length - 2], convex_hull[convex_hull.length - 1], point)) {
                    convex_hull.pop();
                }
                convex_hull.push(point);
            }

            // Remove the first point from convex hull as it isn't within the confidence interval
            convex_hull.shift();

            var convex_pareto_x = convex_hull.map(point => point.cost);
            var convex_pareto_y = convex_hull.map(point => point.accuracy);

            var trace = {
                x: x,
                y: y,
                text: text,
                mode: 'markers+text',
                type: 'scatter',
                marker: {
                    color: colors,
                    size: 10,
                    symbol: colors.map(color => {
                        if (color === '#1b9e77') return 'square'; // blue
                        if (color === '#7570b3') return 'x'; // purple
                        return 'circle'; // orange
                    }),
                    line: {
                        width: 2
                    }
                },
                textposition: 'bottom center',
                hoverinfo: 'text',
                hovertemplate: '<b>%{text}</b><br><br>Cost: $%{x:.2f}<br>Acc: %{y:.2%}<extra></extra>'
            };

            var pareto_trace = {
                x: convex_pareto_x,
                y: convex_pareto_y,
                mode: 'lines',
                name: 'Pareto Frontier',
                line: {
                    color: 'red',
                    width: 2,
                    dash: 'dot'
                }
            };

            var layout = {
                uirevision: true,
                xaxis: { title: 'Cost (USD, measured in April 2024)', rangemode: 'tozero', type: 'log', autorange: true },
                yaxis: { title: 'Accuracy', range: [0.7, 1], autorange: true },
                showlegend: false,
                height: 600, // Adjust height as needed
                margin: {
                    l: 50,
                    r: 50,
                    t: 50,
                    b: 50
                }
            };

            Plotly.react('plot', [trace, pareto_trace], layout);
        }

        $('#gpt4-prompt-price').on('input', updatePlot);
        $('#gpt4-completion-price').on('input', updatePlot);
        $('#gpt3-prompt-price').on('input', updatePlot);
        $('#gpt3-completion-price').on('input', updatePlot);
        $('#l3-8b-prompt-price').on('input', updatePlot);
        $('#l3-8b-completion-price').on('input', updatePlot);
        $('#l3-70b-prompt-price').on('input', updatePlot);
        $('#l3-70b-completion-price').on('input', updatePlot);

        updatePlot();
    });
});
