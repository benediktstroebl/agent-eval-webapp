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

            data.forEach(item => {
                var cost = 0;
                if (item.model === 'GPT-4') {
                    cost = item.mean_prompt_tokens * gpt4PromptPrice + item.mean_completion_tokens * gpt4CompletionPrice;
                } else if (item.model === 'GPT-3.5') {
                    cost = item.mean_prompt_tokens * gpt3PromptPrice + item.mean_completion_tokens * gpt3CompletionPrice;
                }
                x.push(cost);
                y.push(item.mean_accuracy);
                text.push(item.strategy_renamed + ' (' + item.model + ')');
            });

            var trace = {
                x: x,
                y: y,
                text: text,
                mode: 'markers',
                type: 'scatter'
            };

            var layout = {
                title: 'Accuracy vs Cost',
                xaxis: { title: 'Cost (USD)' },
                yaxis: { title: 'Accuracy' }
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
