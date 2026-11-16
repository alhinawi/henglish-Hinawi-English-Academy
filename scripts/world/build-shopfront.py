import bpy, math
from pathlib import Path
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def material(name,color,metal=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=.6;return m
cream=material('Warm painted canvas',(.62,.57,.42));metal=material('Powder coated steel',(.07,.09,.10),.6);wood=material('Oiled walnut',(.18,.09,.04));clay=material('Terracotta',(.35,.12,.06));leaf=material('Leaf green',(.08,.18,.06))
def cube(name,pos,size,mat,bevel=.03):
 bpy.ops.mesh.primitive_cube_add(size=1,location=pos);o=bpy.context.object;o.name=name;o.dimensions=size;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(mat)
 if bevel:mod=o.modifiers.new('Rounded manufactured edges','BEVEL');mod.width=bevel;mod.segments=2;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
 return o
# Shopfront canopy, sloped roof with scalloped trim, supports, cafe bench and planter.
roof=cube('Canvas canopy',(0,-.6,2.7),(5,1.6,.12),cream);roof.rotation_euler.x=math.radians(8)
for x in [-2.3,2.3]:cube('Canopy bracket',(x,-.5,2.4),(.07,1.5,.07),metal)
for x in [-1.5,-1,-.5,0,.5,1,1.5]:cube('Seat slat',(x,-1.6,.5),(.42,.6,.09),wood)
for x in [-1.2,1.2]:cube('Bench foot',(x,-1.6,.25),(.09,.65,.5),metal)
for z in [.75,1,1.25]:cube('Bench back',(0,-1.9,z),(3.5,.09,.15),wood)
for x in [-2.5,2.5]:
 bpy.ops.mesh.primitive_cylinder_add(vertices=16,radius=.3,depth=.5,location=(x,-1,.25));bpy.context.object.data.materials.append(clay)
 for i in range(6):
  bpy.ops.mesh.primitive_uv_sphere_add(segments=8,ring_count=4,radius=.23,location=(x+math.sin(i)*.15,-1+math.cos(i)*.15,.65+(i%3)*.13));bpy.context.object.data.materials.append(leaf)
bpy.ops.export_scene.gltf(filepath=str(Path(__file__).resolve().parents[2] / 'public/models/city/shopfront-authored.glb'),export_format='GLB',export_yup=True)


