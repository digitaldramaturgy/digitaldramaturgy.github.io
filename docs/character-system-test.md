# Character System Test

Let's create a simple test to verify the character system is working:

## Test Steps

1. **Load the character network page**: Navigate to `/character-network.html`
2. **Check for character data**: Ensure `dd_characters` array is populated
3. **Verify network rendering**: Confirm D3.js network appears
4. **Test interactions**: Click on nodes, drag, zoom

## Debugging Tips

### Check browser console for:
- Character data loading messages
- D3.js errors
- Element not found errors

### Common issues:
1. **No character data**: Ensure a CSV is loaded through session storage
2. **Network not rendering**: Check if D3.js library is loaded
3. **Modal not working**: Verify Bootstrap is available

### Fallback for CSV data:
If `characters.csv` is not available, the system will work with session data only.

## Expected Behavior

- Characters appear as nodes sized by scene count
- Connections show shared scenes
- Clicking nodes shows character details
- Network is interactive (drag, zoom, pan)
