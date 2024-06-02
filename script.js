$(document).ready(function() {
    $.getJSON("data.json", function(data) {
        var models = [...new Set(data.map(item => item.model))];
        var modelSelect = $('#model-select');
        
        models.forEach(model => {
            modelSelect.append(new Option(model, model));
        });

        function updatePlot() {
            var selectedModel = modelSelect.val();
            var promptPrice = parseFloat($('#prompt-price').val());
            var completionPrice = parseFloat($('#completion-price').val());

            var filteredData = data.filter(item => item.model === selectedModel);

            var x = filteredData.map(item => item.mean_prompt_tokens * promptPrice + item.mean_completion_tokens * completionPrice);
            var y = filteredData.map(item => item.mean_accuracy);
            var text = filteredData.map(item => item.strategy_renamed);

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

        modelSelect.change(updatePlot);
        $('#prompt-price').on('input', updatePlot);
        $('#completion-price').on('input', updatePlot);

        modelSelect.trigger('change');
    });
});
