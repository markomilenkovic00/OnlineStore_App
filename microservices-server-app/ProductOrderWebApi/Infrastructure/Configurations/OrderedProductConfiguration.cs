using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductOrderWebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProductOrderWebApi.Infrastructure.Configurations
{
    public class OrderedProductConfiguration : IEntityTypeConfiguration<OrderedProduct>
    {
        public void Configure(EntityTypeBuilder<OrderedProduct> builder)
        {
            builder.HasKey(op => new { op.OrderId, op.ProductId });

            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.HasOne(op => op.Order)
               .WithMany(o => o.OrderedProducts)
               .HasForeignKey(op => op.OrderId)
               .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(op => op.Product)
                .WithMany(o => o.OrderedProducts)
                .HasForeignKey(o => o.ProductId)              
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
