"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("KdChart").getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(245, 134, 30, 0.5)");
  gradient.addColorStop(1, "rgba(245,134,30,0)");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: kdGraphData.map((_, index) => `Match ${index + 1}`),
      datasets: [
        {
          label: "KD Ratio",
          data: kdGraphData,
          fill: true,
          borderColor: "#f5861e",
          backgroundColor: gradient,
          tension: 0.1,
          borderWidth: 3,
          pointRadius: 3,
          pointHoverRadius: 7,
          pointBackgroundColor: "#f5861e",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: { stepSize: 5 },
        },
        x: {
          title: { display: true, text: "Letzte Matches" },
        },
      },
      plugins: {
        legend: { display: true, position: "top" },
        tooltip: {
          backgroundColor: "#1e1e1e",
          borderColor: "#f5861e",
          borderWidth: 1,
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
    },
  });
});
