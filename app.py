import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd

# Load the data
df = pd.read_csv('path/to/plot_data_0409_grouped.csv')

# Initialize the Dash app
app = dash.Dash(__name__)

# Define the layout of the app
app.layout = html.Div([
    html.H1('Agent Evaluation Interactive Plot'),
    dcc.Graph(id='scatter-plot'),
    html.Label('Select Model:'),
    dcc.Dropdown(
        id='model-dropdown',
        options=[{'label': model, 'value': model} for model in df['model'].unique()],
        value=df['model'].unique()[0]
    ),
    html.Label('Price per Prompt Token:'),
    dcc.Input(id='prompt-price', type='number', value=0.01, step=0.01),
    html.Label('Price per Completion Token:'),
    dcc.Input(id='completion-price', type='number', value=0.02, step=0.01),
])

# Define the callback to update the plot
@app.callback(
    Output('scatter-plot', 'figure'),
    [Input('model-dropdown', 'value'),
     Input('prompt-price', 'value'),
     Input('completion-price', 'value')]
)
def update_plot(selected_model, prompt_price, completion_price):
    filtered_df = df[df['model'] == selected_model]
    filtered_df['cost'] = filtered_df['mean_prompt_tokens'] * prompt_price + filtered_df['mean_completion_tokens'] * completion_price
    fig = px.scatter(filtered_df, x='cost', y='mean_accuracy',
                     color='strategy_renamed', text='strategy_renamed',
                     hover_name='strategy_renamed')
    fig.update_traces(textposition='top center')
    fig.update_layout(title='Accuracy vs Cost', xaxis_title='Cost (USD)', yaxis_title='Accuracy')
    return fig

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)
