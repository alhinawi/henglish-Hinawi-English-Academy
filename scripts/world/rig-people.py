"""Create lightweight idle/walk skeletons for the bundled CC0 adult meshes.
Run with Blender 4.3+: blender -b --python scripts/world/rig-people.py
Spatial weights are authored for these two meshes, not a general auto-rigger.
"""
import bpy, math
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[2]/'public/models/city'
for kind in ['man','woman']:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 for action in list(bpy.data.actions):bpy.data.actions.remove(action)
 bpy.ops.import_scene.gltf(filepath=str(ROOT/f'person-{kind}.glb'))
 meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
 # Apply imported transforms and normalize height before assigning anatomical weights.
 lo=min((o.matrix_world@v.co).z for o in meshes for v in o.data.vertices)
 hi=max((o.matrix_world@v.co).z for o in meshes for v in o.data.vertices)
 for o in meshes:
  matrix=o.matrix_world.copy();o.parent=None;o.matrix_world.identity()
  for v in o.data.vertices:
   v.co=matrix@v.co;v.co.z-=lo;v.co*=1.8/(hi-lo)
 bpy.ops.object.armature_add();rig=bpy.context.object;rig.name='AdultRig'
 bpy.ops.object.mode_set(mode='EDIT');rig.data.edit_bones.remove(rig.data.edit_bones[0])
 def bone(name,head,tail,parent=None):
  b=rig.data.edit_bones.new(name);b.head=head;b.tail=tail
  if parent:b.parent=rig.data.edit_bones[parent]
 bone('Root',(0,0,0),(0,0,.1))
 bone('Hips',(0,0,.9),(0,0,1.08),'Root')
 bone('Spine',(0,0,1.08),(0,0,1.48),'Hips')
 bone('Head',(0,0,1.48),(0,0,1.79),'Spine')
 for sign,side in [(-1,'L'),(1,'R')]:
  bone('Thigh'+side,(sign*.10,0,.92),(sign*.10,0,.49),'Hips')
  bone('Shin'+side,(sign*.10,0,.49),(sign*.10,0,.09),'Thigh'+side)
  bone('Arm'+side,(sign*.19,0,1.45),(sign*.30,0,1.05),'Spine')
  bone('Forearm'+side,(sign*.30,0,1.05),(sign*.31,-.03,.75),'Arm'+side)
 bpy.ops.object.mode_set(mode='OBJECT')
 def blend(z,mid,width):return max(0,min(1,(z-mid)/width+.5))
 for o in meshes:
  groups={b.name:o.vertex_groups.new(name=b.name) for b in rig.data.bones}
  for v in o.data.vertices:
   x,y,z=v.co;side='L' if x<0 else 'R';ax=abs(x)
   if z>1.48:weights={'Head':blend(z,1.49,.12),'Spine':1-blend(z,1.49,.12)}
   elif ax> .22 and .72<z<1.46:
    w=blend(z,1.08,.18);weights={'Arm'+side:w,'Forearm'+side:1-w}
   elif z<.94:
    w=blend(z,.49,.18);weights={'Thigh'+side:w,'Shin'+side:1-w}
    if z>.84:
     h=blend(z,.90,.12);weights={k:w*(1-h) for k,w in weights.items()};weights['Hips']=h
   else:
    w=blend(z,1.08,.24);weights={'Spine':w,'Hips':1-w}
   for name,w in weights.items():
    if w>0:groups[name].add([v.index],w,'REPLACE')
  mod=o.modifiers.new('Adult skeleton','ARMATURE');mod.object=rig;o.parent=rig
 # Gentle skeletal idle and restrained walking, 24fps. Root motion stays in the application.
 rig.animation_data_create()
 for clip,frames in [('Idle',72),('Walk',24)]:
  action=bpy.data.actions.new(clip);rig.animation_data.action=action
  for f in range(0,frames+1,3):
   phase=f/frames*math.tau
   for p in rig.pose.bones:p.rotation_mode='XYZ';p.rotation_euler=(0,0,0);p.location=(0,0,0)
   if clip=='Walk':
    for sign,side in [(-1,'L'),(1,'R')]:
     swing=math.sin(phase)*sign
     rig.pose.bones['Thigh'+side].rotation_euler.x=swing*.32
     rig.pose.bones['Shin'+side].rotation_euler.x=max(0,-swing)*.42
     rig.pose.bones['Arm'+side].rotation_euler.x=-swing*.22
     rig.pose.bones['Forearm'+side].rotation_euler.x=-.10-max(0,swing)*.12
    rig.pose.bones['Hips'].location.y=abs(math.sin(phase))*.012
   else:
    rig.pose.bones['Spine'].rotation_euler.x=math.sin(phase)*.012
    rig.pose.bones['Head'].rotation_euler.z=math.sin(phase)*.025
    rig.pose.bones['ArmL'].rotation_euler.x=math.sin(phase)*.025
    rig.pose.bones['ArmR'].rotation_euler.x=-math.sin(phase)*.025
   for p in rig.pose.bones:
    p.keyframe_insert('rotation_euler',frame=f);p.keyframe_insert('location',frame=f)
  track=rig.animation_data.nla_tracks.new();track.name=clip;track.strips.new(clip,0,action);track.mute=True
 rig.animation_data.action=None
 for p in rig.pose.bones:p.rotation_euler=(0,0,0);p.location=(0,0,0)
 bpy.context.scene.frame_set(0)
 bpy.ops.export_scene.gltf(filepath=str(ROOT/f'person-{kind}-rigged.glb'),export_format='GLB',export_animation_mode='ACTIONS',export_force_sampling=True,export_frame_range=False)
