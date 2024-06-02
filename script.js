$(document).ready(function() {
    $.getJSON("data.json", function(data) {
        function updatePlot() {
            var gpt4PromptPrice = parseFloat($('#gpt4-prompt-price').val());
            var gpt4CompletionPrice = parseFloat($('#gpt4-completion-price').val());
            var gpt3PromptPrice = parseFloat($('#gpt3-prompt-price').val());
            var gpt3CompletionPrice = parseFloat($('#gpt3-completion-price').val());

            var x = [];
            var y = [];
            var text = [];
            var labels = [];
            var colors = [];

            var color_dict = {
                'GPT-4': 'blue',
                'GPT-3.5': 'blue',
                'LDB (GPT-4)': 'orange',
                'LDB (GPT-3.5)': 'orange',
                'Escalation': 'green',
                'Reflexion (GPT-4)': 'orange',
                "LATS (GPT-4, GPT-3.5)": 'orange',
                "Retry (GPT-4)": 'green',
                "Warming (GPT-4-1step)": 'blue',
                "LDB (Reflexion, GPT-4)": 'orange',
                "LDB (GPT-4, GPT-3.5)": 'orange',
                "LATS (GPT-4)": 'orange',
                "LATS (GPT-3.5)": 'orange',
                "LDB (Reflexion, GPT-3.5)": 'orange',
                "Warming (GPT-4)": 'green',
                'GPT-4': 'blue',
                'GPT-3.5': 'blue',
                'LDB (GPT-4)': 'orange',
                'LDB (GPT-3.5)': 'orange',
                'Escalation': 'green',
                'Reflexion (GPT-4)': 'orange',
                "LATS (GPT-3.5)": 'orange',
                "Retry (GPT-4)": 'green',
                "Warming (GPT-4-1step)": 'blue',
                "LDB (GPT-4, Reflexion)": 'orange',
                "LDB (GPT-3.5, GPT-4)": 'orange',
                "LATS (GPT-4)": 'orange',
                "LDB (GPT-3.5, Reflexion)": 'orange',
                "Reflexion (GPT-3.5)": 'orange',
                "Repeat (GPT-3.5)": 'green',
                "Warming (GPT-4)": 'green'
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
                } else if (item.model === 'GPT-4') {
                    cost = item.mean_prompt_tokens * gpt4PromptPrice + item.mean_completion_tokens * gpt4CompletionPrice;
                } else if (item.model === 'GPT-3.5') {
                    cost = item.mean_prompt_tokens * gpt3PromptPrice + item.mean_completion_tokens * gpt3CompletionPrice;
                } 
                x.push(cost);
                y.push(item.mean_accuracy);
                text.push(item.strategy_renamed + ' (' + item.model + ')');
                labels.push(item.strategy_renamed + ' (' + item.model + ')');
                colors.push(color_dict[item.strategy_renamed] || 'black');
            });

            var trace = {
                x: x,
                y: y,
                text: text,
                mode: 'markers+text',
                type: 'scatter',
                marker: {
                    color: colors,
                    size: 10,
                    line: {
                        width: 2
                    }
                },
                textposition: 'top center',
                hoverinfo: 'text'
            };

            var layout = {
                title: 'Accuracy vs Cost',
                xaxis: { title: 'Cost (USD)', rangemode: 'tozero' },
                yaxis: { title: 'Accuracy', rangemode: 'tozero' },
                showlegend: false
            };

            Plotly.newPlot('plot', [trace], layout);
        }

        $('#gpt4-prompt-price').on('input', updatePlot);
        $('#gpt4-completion-price').on('input', updatePlot);
        $('#gpt3-prompt-price').on('input', updatePlot);
        $('#gpt3-completion-price').on('input', updatePlot);

        updatePlot();
    });
});
