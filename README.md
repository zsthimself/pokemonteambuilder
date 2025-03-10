# Pokemon Team Planner

A web-based tool to help Pokemon players build, analyze, and optimize their battle teams.

## Overview

Pokemon Team Planner is an interactive web application designed to simplify the team-building process for Pokemon players. Whether you're a competitive battler, strategy researcher, or casual player, this tool provides valuable insights into team composition and type matchups.

## Features

### Pokemon Selection
- Complete Pokemon database with all generations
- Filter by name, number, and type
- View basic Pokemon information (image, name, type)

### Team Building
- Select up to 6 Pokemon for your team
- Add and remove Pokemon easily
- Drag and drop interface for team management

### Type Analysis
- Calculate team-wide type weaknesses and resistances
- Visualize type matchup relationships
- Get simple team rating based on type coverage

### Team Management
- Save teams to browser local storage
- Name and manage multiple teams
- Quick access to your saved teams

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required - runs entirely in browser

### Installation

As a web application, Pokemon Team Planner requires no installation. Simply visit the website to start using the tool.

For local development:

1. Clone the repository
   ```
   git clone https://github.com/yourusername/pokemon-team-planner.git
   ```

2. Navigate to the project directory
   ```
   cd pokemon-team-planner
   ```

3. Open `index.html` in your browser or use a local server
   ```
   python -m http.server 8000
   ```

4. Visit `http://localhost:8000` in your browser

## Usage

1. Browse or search for Pokemon in the selection panel
2. Click on Pokemon to add them to your team (maximum 6)
3. View the type analysis chart to see your team's strengths and weaknesses
4. Save your team with a custom name
5. Create multiple teams and switch between them

## Technology Stack

- HTML5
- CSS3 with Bootstrap 5
- Vanilla JavaScript
- Local Storage API for team saving
- PokeAPI data (preprocessed for performance)

## Future Enhancements

- Move coverage analysis
- Team sharing functionality
- Additional generations of Pokemon
- Performance optimizations
- Mobile experience improvements
- Theme switching

## Data Sources

- Pokemon data: [PokeAPI](https://pokeapi.co/)
- Pokemon sprites: Official Pokemon sprites
- Type matchup data: Based on official Pokemon game mechanics

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve the Pokemon Team Planner.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Pokemon is a trademark of Nintendo, Game Freak, and Creatures Inc.
- This tool is created by fans, for fans, and is not affiliated with the official Pokemon franchise.
- Inspired by similar tools like Marriland Team Builder and Pokemon Showdown.