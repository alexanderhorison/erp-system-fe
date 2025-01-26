import React from "react";
import { Grid, Typography, Paper, Divider, Card } from "@mui/material";
import { Box } from "@mui/system";

export default function DetailOpenBill({ data }) {
  const { id, customer, products, warehouse, subTotalPrice, totalItem } = data;

  return (
    <Box sx={{ p: 3, height: "85%", overflow: "auto", bgcolor: "" }}>
      <Typography variant="h4" gutterBottom>
        Bill Details
      </Typography>

      <Grid container spacing={2}>
        {/* Bill ID */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            Bill ID
          </Typography>
          <Typography variant="body1">{id}</Typography>
        </Grid>

        {/* Warehouse */}
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" fontWeight="bold">
            Warehouse Name
          </Typography>
          <Typography variant="body1">{warehouse?.warehouseName}</Typography>
        </Grid>

        <Divider style={{ width: "100%", margin: "20px 0" }} />

        {/* Customer Info */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Customer Information
          </Typography>
          {Object.keys(customer || {}).length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              No customer details available.
            </Typography>
          ) : (
            <Typography variant="body1">{JSON.stringify(customer)}</Typography>
          )}
        </Grid>

        <Divider style={{ width: "100%", margin: "20px 0" }} />

        {/* Products */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Products
          </Typography>
          {products.map((product, index) => (
            <Grid
              container
              spacing={1}
              key={product.id}
              style={{ marginBottom: "10px" }}
            >
              <Grid item xs={6}>
                <Typography variant="subtitle1">Product Name:</Typography>
                <Typography variant="body1">{product.productName}</Typography>
                <Typography variant="subtitle1">Notes: {product.notes}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1">Quantity:</Typography>
                <Typography variant="body1">{product.quantity}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1">Price:</Typography>
                <Typography variant="body1">
                  Rp {product.price.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="subtitle1">Subtotal:</Typography>
                <Typography variant="body1">
                  Rp {product.subTotal.toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Divider style={{ width: "100%", margin: "20px 0" }} />

        {/* Summary */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Total Items:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{totalItem}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Total Price:</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                Rp {subTotalPrice.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
