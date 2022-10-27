import pandas as pd

df = pd.read_csv('change-forest-area-share-total.csv')
df = df[df['Year'] == 2015].reset_index(drop=True)
df.to_json('change-forest-area-share-total.json', orient='records')