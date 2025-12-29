Dashboard

This is a real-time monitoring interface for factory machines. It's built with Svelte 5 and Tailwind CSS.

Dashboard
<img width="2878" height="1622" alt="image" src="https://github.com/user-attachments/assets/80350e50-3d3a-4900-ab66-3f1000c34b63" />

Detailed view of the Machine

<img width="1439" height="811" alt="Screenshot 2025-12-29 at 1 21 47 PM" src="https://github.com/user-attachments/assets/7456f340-8b42-4cb3-a199-1ca095e31254" />



Live Monitoring: It automatically pulls machine data every 10 seconds.
Smart Filtering: You can filter by status like Active, Idle, Breakdown, or Offline.
Sorting: You can organize machines by ID or by RPM to see which ones are running fastest.

Machine Details: Click on any machine to see its history, who is operating it, and when it was last maintained.

Error Handling: The app includes skeletons for loading and a retry system if the connection fails.


Quick Start:
Run npm install to get dependencies.
Run npm run dev to start the project.
Open http://localhost:5173 to see it in action.
