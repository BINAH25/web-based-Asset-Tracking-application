import React, { useState,useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useLazyGetAssetsStatiticsQuery } from '../../../features/resources/resources-api-slice';
import Iconify from '../../../components/iconify';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

// ----------------------------------------------------------------------

export default function AppView() {

  const [getStatitics, { data: response = [], isLoadding }] = useLazyGetAssetsStatiticsQuery();

  useEffect(() => {
    getStatitics(); 
  }, [getStatitics]);


  const totalProducts = response?.total_product_count || 0;
  const totalAvailableProducts = response?.total_available_product_count || 0;
  const totalProductsOut = response?.total_product_giving_out_count || 0;
  const totalInstitutions = response?.total_institutions_count || 0;
  const totalUsers = response?.total_users_count || 0;
  const totalTags = response?.total_tags_count || 0;
  const functional = response?.total_functional_assets_count || 0;
  const maintenance = response?.total_assets_in_maintenance_count || 0;
  const spoilt = response?.total_spoilt_assets_count || 0;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Total Products"
            total={totalProducts}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Total Products Available"
            total={totalAvailableProducts}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Total Products Out"
            total={totalProductsOut}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Total Users"
            total={totalUsers}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/users.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Total Instititions"
            total={totalInstitutions}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/institutions.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <AppWidgetSummary
            title="Total Tags"
            total={totalTags}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={12}>
          <AppCurrentVisits
            title="Assets Status"
            chart={{
              series: [
                { label: 'Functional', value: functional },
                { label: 'In Maintenance', value: maintenance },
                { label: 'Spoilt', value: spoilt },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
