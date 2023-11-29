// vite.config.mts
import { defineConfig } from "file:///Users/attilavarga/codes/tradeGame/node_modules/.pnpm/vite@5.0.2_@types+node@20.10.0_sass@1.69.5/node_modules/vite/dist/node/index.js";
import react from "file:///Users/attilavarga/codes/tradeGame/node_modules/.pnpm/@vitejs+plugin-react@4.2.0_vite@5.0.2/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { createHtmlPlugin } from "file:///Users/attilavarga/codes/tradeGame/node_modules/.pnpm/vite-plugin-html@3.2.0_vite@5.0.2/node_modules/vite-plugin-html/dist/index.mjs";
import path from "path";
import checker from "file:///Users/attilavarga/codes/tradeGame/node_modules/.pnpm/vite-plugin-checker@0.6.2_eslint@8.54.0_typescript@5.3.2_vite@5.0.2/node_modules/vite-plugin-checker/dist/esm/main.js";
var __vite_injected_original_dirname = "/Users/attilavarga/codes/tradeGame";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    createHtmlPlugin({
      entry: "./src/index.tsx",
      template: "./src/index.html",
      inject: {
        data: {
          title: "index",
          injectScript: `<script src="./inject.js"></script>`
        }
      }
    }),
    checker({
      typescript: true
      // eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"'},
    })
  ],
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    strictPort: true
  },
  // to access the Tauri environment variables set by the CLI with information about the current target
  envPrefix: [
    "VITE_",
    "TAURI_PLATFORM",
    "TAURI_ARCH",
    "TAURI_FAMILY",
    "TAURI_PLATFORM_VERSION",
    "TAURI_PLATFORM_TYPE",
    "TAURI_DEBUG"
  ],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG
  },
  resolve: {
    alias: {
      "@Services": path.resolve(__vite_injected_original_dirname, "./src/services"),
      "@Components": path.resolve(__vite_injected_original_dirname, "./src/components")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubXRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2F0dGlsYXZhcmdhL2NvZGVzL3RyYWRlR2FtZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2F0dGlsYXZhcmdhL2NvZGVzL3RyYWRlR2FtZS92aXRlLmNvbmZpZy5tdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2F0dGlsYXZhcmdhL2NvZGVzL3RyYWRlR2FtZS92aXRlLmNvbmZpZy5tdHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1odG1sXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGNoZWNrZXIgZnJvbSBcInZpdGUtcGx1Z2luLWNoZWNrZXJcIjtcbmltcG9ydCBlc2xpbnQgZnJvbSBcIi4vLmVzbGludHJjLmpzb25cIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgY3JlYXRlSHRtbFBsdWdpbih7XG4gICAgICBlbnRyeTogXCIuL3NyYy9pbmRleC50c3hcIixcbiAgICAgIHRlbXBsYXRlOiBcIi4vc3JjL2luZGV4Lmh0bWxcIixcbiAgICAgIGluamVjdDoge1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgdGl0bGU6IFwiaW5kZXhcIixcbiAgICAgICAgICBpbmplY3RTY3JpcHQ6IGA8c2NyaXB0IHNyYz1cIi4vaW5qZWN0LmpzXCI+PC9zY3JpcHQ+YCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgY2hlY2tlcih7XG4gICAgICB0eXBlc2NyaXB0OiB0cnVlLFxuICAgICAgLy8gZXNsaW50OiB7IGxpbnRDb21tYW5kOiAnZXNsaW50IFwiLi9zcmMvKiovKi57dHMsdHN4fVwiJ30sXG4gICAgfSksXG4gIF0sXG4gIC8vIHByZXZlbnQgdml0ZSBmcm9tIG9ic2N1cmluZyBydXN0IGVycm9yc1xuICBjbGVhclNjcmVlbjogZmFsc2UsXG4gIC8vIFRhdXJpIGV4cGVjdHMgYSBmaXhlZCBwb3J0LCBmYWlsIGlmIHRoYXQgcG9ydCBpcyBub3QgYXZhaWxhYmxlXG4gIHNlcnZlcjoge1xuICAgIHN0cmljdFBvcnQ6IHRydWUsXG4gIH0sXG4gIC8vIHRvIGFjY2VzcyB0aGUgVGF1cmkgZW52aXJvbm1lbnQgdmFyaWFibGVzIHNldCBieSB0aGUgQ0xJIHdpdGggaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgdGFyZ2V0XG4gIGVudlByZWZpeDogW1xuICAgIFwiVklURV9cIixcbiAgICBcIlRBVVJJX1BMQVRGT1JNXCIsXG4gICAgXCJUQVVSSV9BUkNIXCIsXG4gICAgXCJUQVVSSV9GQU1JTFlcIixcbiAgICBcIlRBVVJJX1BMQVRGT1JNX1ZFUlNJT05cIixcbiAgICBcIlRBVVJJX1BMQVRGT1JNX1RZUEVcIixcbiAgICBcIlRBVVJJX0RFQlVHXCIsXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gVGF1cmkgdXNlcyBDaHJvbWl1bSBvbiBXaW5kb3dzIGFuZCBXZWJLaXQgb24gbWFjT1MgYW5kIExpbnV4XG4gICAgdGFyZ2V0OiBwcm9jZXNzLmVudi5UQVVSSV9QTEFURk9STSA9PSBcIndpbmRvd3NcIiA/IFwiY2hyb21lMTA1XCIgOiBcInNhZmFyaTEzXCIsXG4gICAgLy8gZG9uJ3QgbWluaWZ5IGZvciBkZWJ1ZyBidWlsZHNcbiAgICBtaW5pZnk6ICFwcm9jZXNzLmVudi5UQVVSSV9ERUJVRyA/IFwiZXNidWlsZFwiIDogZmFsc2UsXG4gICAgLy8gcHJvZHVjZSBzb3VyY2VtYXBzIGZvciBkZWJ1ZyBidWlsZHNcbiAgICBzb3VyY2VtYXA6ICEhcHJvY2Vzcy5lbnYuVEFVUklfREVCVUcsXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJAU2VydmljZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9zZXJ2aWNlc1wiKSxcbiAgICAgIFwiQENvbXBvbmVudHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9jb21wb25lbnRzXCIpLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMFIsU0FBUyxvQkFBb0I7QUFDdlQsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsd0JBQXdCO0FBQ2pDLE9BQU8sVUFBVTtBQUNqQixPQUFPLGFBQWE7QUFKcEIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04saUJBQWlCO0FBQUEsTUFDZixPQUFPO0FBQUEsTUFDUCxVQUFVO0FBQUEsTUFDVixRQUFRO0FBQUEsUUFDTixNQUFNO0FBQUEsVUFDSixPQUFPO0FBQUEsVUFDUCxjQUFjO0FBQUEsUUFDaEI7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixZQUFZO0FBQUE7QUFBQSxJQUVkLENBQUM7QUFBQSxFQUNIO0FBQUE7QUFBQSxFQUVBLGFBQWE7QUFBQTtBQUFBLEVBRWIsUUFBUTtBQUFBLElBQ04sWUFBWTtBQUFBLEVBQ2Q7QUFBQTtBQUFBLEVBRUEsV0FBVztBQUFBLElBQ1Q7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLFFBQVEsUUFBUSxJQUFJLGtCQUFrQixZQUFZLGNBQWM7QUFBQTtBQUFBLElBRWhFLFFBQVEsQ0FBQyxRQUFRLElBQUksY0FBYyxZQUFZO0FBQUE7QUFBQSxJQUUvQyxXQUFXLENBQUMsQ0FBQyxRQUFRLElBQUk7QUFBQSxFQUMzQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDckQsZUFBZSxLQUFLLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsSUFDM0Q7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
