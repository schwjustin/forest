#!/usr/bin/env python
# coding: utf-8

# In[26]:


import pandas as pd


# In[27]:


df = pd.read_csv('annual-change-forest-area.csv', header = None)


# In[28]:


df


# In[30]:


df.to_json (r'/Users/christiansalvatierraancheta/Downloads/annual-change-forest-area.json')


# In[ ]:




