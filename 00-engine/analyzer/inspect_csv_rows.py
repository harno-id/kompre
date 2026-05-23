import pandas as pd,json,ast
from pathlib import Path
p=Path(r'D:\DATA\TESIS\KOMPRE\HARNO-KOMPRE\02-data\cuq\cuq_responses_rows.csv')
df=pd.read_csv(p)
for i in range(3):
 print('ROW',i, 'id', df.loc[i,'id'], 'respondent', df.loc[i,'respondent_id_text'])
 for col in ['profil','bagian_b','cuq_formal','cuq_genz']:
  s=str(df.loc[i,col])
  print(col, s[:500].encode('ascii','backslashreplace').decode())
