# Demo CSV for Character System Testing

Use this sample CSV structure to test the character system:

```csv
play,author,description,act,scene,player,line_number,line_text
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",1,1,"Duke of Vienna",1,"Escalus."
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",1,1,"Escalus",2,"My lord."
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",1,1,"Duke of Vienna",3,"Of government the properties to unfold Would seem in me t' affect speech and discourse"
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",1,2,"Angelo",4,"Always obedient to your Grace's will I come to know your pleasure."
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",1,2,"Duke of Vienna",5,"Angelo There is a kind of character in thy life That to th' observer doth thy history Fully unfold."
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",1,3,"Isabella",6,"And have you nuns no farther privileges?"
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",1,3,"Francisca",7,"Are not these large enough?"
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",2,1,"Duke of Vienna",8,"No, holy father, throw away that thought"
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",2,1,"Angelo",9,"We shall write to you As time and our concernings shall importune"
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",2,2,"Isabella",10,"Must he needs die?"
"Measure for Measure","William Shakespeare","A comedy about justice and mercy",2,2,"Angelo",11,"Maiden, no remedy."
```

This creates a network where:
- Duke of Vienna appears in scenes 1.1, 1.2, 2.1 (3 scenes)
- Angelo appears in scenes 1.2, 2.1, 2.2 (3 scenes)  
- Isabella appears in scenes 1.3, 2.2 (2 scenes)
- Escalus appears in scene 1.1 (1 scene)
- Francisca appears in scene 1.3 (1 scene)

Connections:
- Duke of Vienna ↔ Angelo (2 shared scenes: 1.2, 2.1)
- Duke of Vienna ↔ Escalus (1 shared scene: 1.1)
- Angelo ↔ Isabella (1 shared scene: 2.2)
- Isabella ↔ Francisca (1 shared scene: 1.3)
